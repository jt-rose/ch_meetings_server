import {
  Resolver,
  Query,
  Mutation,
  Int,
  Arg,
  Ctx,
  FieldResolver,
  Root,
} from 'type-graphql'
import { Advisor } from './Advisor'
import { AdvisorLanguage } from './AdvisorLanguage'
import { AdvisorRegion } from './AdvisorRegion'
import { AdvisorUnavailableTime } from './AdvisorUnavailableTime'
import { AdvisorNote } from './AdvisorNote'
import { Context } from '../../utils/context'
import { Authenticated, AdminOnly } from '../../middleware/authChecker'
import { CustomError } from '../../middleware/errorHandler'

@Resolver(Advisor)
export class AdvisorResolver {
  /* ----------------------------- field resolvers ---------------------------- */

  // workshops - field resolver
  @FieldResolver(() => [AdvisorLanguage])
  languages(@Ctx() ctx: Context, @Root() advisor: Advisor) {
    return ctx.prisma.advisors
      .findUnique({
        where: { advisor_id: advisor.advisor_id },
      })
      .languages()
  }

  @FieldResolver(() => [AdvisorRegion])
  regions(@Ctx() ctx: Context, @Root() advisor: Advisor) {
    return ctx.prisma.advisors
      .findUnique({
        where: { advisor_id: advisor.advisor_id },
      })
      .regions()
  }

  @FieldResolver(() => [AdvisorUnavailableTime])
  unavailable_times(@Ctx() ctx: Context, @Root() advisor: Advisor) {
    return ctx.prisma.advisors
      .findUnique({
        where: { advisor_id: advisor.advisor_id },
      })
      .advisor_unavailable_times()
  }

  @FieldResolver(() => [AdvisorNote])
  advisor_notes(@Ctx() ctx: Context, @Root() advisor: Advisor) {
    return ctx.prisma.advisors
      .findUnique({
        where: { advisor_id: advisor.advisor_id },
      })
      .advisor_notes()
  }

  @FieldResolver()
  assigned_workshops(@Ctx() ctx: Context, @Root() root: Advisor) {
    return ctx.prisma.advisors
      .findUnique({ where: { advisor_id: root.advisor_id } })
      .workshops_advisorsToworkshops_assigned_advisor_id()
  }

  @FieldResolver()
  async requested_workshops(@Ctx() ctx: Context, @Root() root: Advisor) {
    return ctx.prisma.advisors
      .findUnique({ where: { advisor_id: root.advisor_id } })
      .workshops_advisorsToworkshops_requested_advisor_id({
        where: { assigned_advisor_id: null },
      })
  }

  /* ----------------------------- CRUD operations ---------------------------- */
  // getAdvisor
  @Authenticated()
  @Query(() => Advisor, { nullable: true })
  async getAdvisor(
    @Ctx() ctx: Context,
    @Arg('advisor_id', () => Int) advisor_id: number
  ) {
    return ctx.prisma.advisors.findFirst({
      where: { advisor_id },
    })
  }

  //getAllAdvisors
  @Authenticated()
  @Query(() => [Advisor])
  async getAllAdvisors(@Ctx() ctx: Context) {
    // add pagination later
    return ctx.prisma.advisors.findMany()
  }

  // addAdvisor
  @AdminOnly()
  @Mutation(() => Advisor)
  async addAdvisor(
    @Ctx() ctx: Context,
    @Arg('email', () => String) email: string,
    @Arg('first_name', () => String) first_name: string,
    @Arg('last_name', () => String) last_name: string
  ) {
    // check for email already used
    const emailRegistered = await ctx.prisma.advisors.count({
      where: { email },
    })
    if (emailRegistered) {
      throw new CustomError(
        `Advisor with email "${email}" already registered in the system`
      )
    }
    // add languages, regions, unavailable days at same time?
    return ctx.prisma.advisors.create({
      data: { email, first_name, last_name },
    })
  }

  //editAdvisor
  @AdminOnly()
  @Mutation(() => Advisor)
  async editAdvisor(
    @Ctx() ctx: Context,
    @Arg('advisor_id', () => Int) advisor_id: number,
    @Arg('email', () => String, { nullable: true }) email: string,
    @Arg('first_name', () => String, { nullable: true }) first_name: string,
    @Arg('last_name', () => String, { nullable: true }) last_name: string
  ) {
    // check that new email not in use
    if (email) {
      const currentlyUsed = await ctx.prisma.advisors.count({
        where: { email },
      })
      if (currentlyUsed) {
        throw new CustomError(
          `Email "${email}" is already registered with an advisor in our system`
        )
      }
    }
    // update advisor data
    return ctx.prisma.advisors.update({
      where: { advisor_id },
      data: { email, first_name, last_name },
    })
  }

  // removeAdvisor
  @AdminOnly()
  @Mutation(() => Advisor)
  async removeAdvisor(
    @Ctx() ctx: Context,
    @Arg('advisor_id', () => Int) advisor_id: number
  ) {
    // NOTE: deleting an advisor will be rejected if they are currently assigned
    // or requested for a workshop
    // this even applies to workshops with a 'deleted' status
    // as such workshops can be recovered and would need to retain a valid advisor reference
    // in this circumstance the workshop would need to be permanently deleted
    // or the advisor reference would need to be changed
    // before the advisor could be deleted

    // reject if currently assigned workshops
    const hasWorkshops = await ctx.prisma.workshops.count({
      where: { assigned_advisor_id: advisor_id },
    })
    if (hasWorkshops) {
      throw new CustomError(
        `Advisor #${advisor_id} cannot be deleted because this advisor currently has past or present workshops assigned`
      )
    }

    // reject if advisor has been requested
    const hasBeenRequested = await ctx.prisma.workshops.findFirst({
      where: {
        requested_advisor_id: advisor_id,
      },
    })
    if (hasBeenRequested) {
      throw new CustomError(
        `Advisor #${advisor_id} has been requested for workshops. Please clear this request before removing the advisor.`
      )
    }

    // set up parts of a transaction to run a cascading delete
    const removeLanguages = ctx.prisma.languages.deleteMany({
      where: { advisor_id },
    })

    const removeRegions = ctx.prisma.regions.deleteMany({
      where: { advisor_id },
    })

    const removeUnavailableDays =
      ctx.prisma.advisor_unavailable_times.deleteMany({
        where: { advisor_id },
      })

    const removeAdvisorNotes = ctx.prisma.advisor_notes.deleteMany({
      where: { advisor_id },
    })

    const removeTheAdvisor = ctx.prisma.advisors.delete({
      where: { advisor_id },
    })

    // run the transaction
    const transaction = await ctx.prisma.$transaction([
      removeLanguages,
      removeRegions,
      removeUnavailableDays,
      removeAdvisorNotes,
      removeTheAdvisor,
    ])
    return transaction[4]
  }

  @AdminOnly()
  @Mutation(() => Advisor)
  async changeAdvisorActiveStatus(
    @Ctx() ctx: Context,
    @Arg('advisor_id', () => Int) advisor_id: number,
    @Arg('active') active: boolean
  ) {
    if (!active) {
      const advisorWorkshops = await ctx.prisma.workshops.findMany({
        where: { assigned_advisor_id: advisor_id },
        include: { workshop_sessions: true },
      })
      const hasActiveWorkshops = advisorWorkshops.some(
        (workshop) =>
          workshop.workshop_status !== 'COMPLETED' &&
          workshop.workshop_status !== 'CANCELLED'
      )
      if (hasActiveWorkshops) {
        throw new CustomError(
          'Advisor cannot be deactivated as they have upcoming workshops scheduled'
        )
      }
    }

    return ctx.prisma.advisors.update({
      where: { advisor_id },
      data: { active },
    })
  }
}
