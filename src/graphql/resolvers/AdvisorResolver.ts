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
import { Advisor } from '../objects/Advisor'
import { AdvisorLanguage } from '../objects/AdvisorLanguage'
import { AdvisorRegion } from '../objects/AdvisorRegion'
import { AdvisorUnavailableDay } from '../objects/AdvisorUnavailableDay'
import { AdvisorNote } from '../objects/AdvisorNote'
import { Context } from '../../utils/context'

@Resolver(Advisor)
export class AdvisorResolver {
  /* ----------------------------- field resolvers ---------------------------- */

  // workshops - field resolver
  // unavailable_days - field resolver
  // regions - field resolver
  // languages - field resolver
  @FieldResolver(() => [AdvisorLanguage])
  async languages(@Ctx() ctx: Context, @Root() advisor: Advisor) {
    return ctx.prisma.languages.findMany({
      where: { advisor_id: advisor.advisor_id },
    })
  }

  @FieldResolver(() => [AdvisorRegion])
  async regions(@Ctx() ctx: Context, @Root() advisor: Advisor) {
    return ctx.prisma.regions.findMany({
      where: { advisor_id: advisor.advisor_id },
    })
  }

  @FieldResolver(() => [AdvisorUnavailableDay])
  async unavailable_days(@Ctx() ctx: Context, @Root() advisor: Advisor) {
    return ctx.prisma.unavailable_days.findMany({
      where: { advisor_id: advisor.advisor_id },
    })
  }

  @FieldResolver(() => [AdvisorNote])
  async advisor_notes(@Ctx() ctx: Context, @Root() advisor: Advisor) {
    return ctx.prisma.advisor_notes.findMany({
      where: { advisor_id: advisor.advisor_id },
    })
  }
  /*
  @FieldResolver()
  async assigned_workshops(@Ctx() ctx: Context, @Root() advisor: Advisor) {
    return ctx.prisma.workshops.findMany({
      where: { assigned_advisor: advisor.advisor_id },
    })
  }
  */

  /* ----------------------------- CRUD operations ---------------------------- */
  // getAdvisor
  // refactor later with dataloader
  @Query(() => Advisor)
  async getAdvisor(
    @Ctx() ctx: Context,
    @Arg('advisor_id', () => Int) advisor_id: number
  ) {
    return ctx.prisma.advisors.findFirst({
      where: { advisor_id },
      include: { languages: true, regions: true, unavailable_days: true },
    })
  }

  //getAllAdvisors
  @Query(() => [Advisor])
  async getAllAdvisors(@Ctx() ctx: Context) {
    return ctx.prisma.advisors.findMany()
  }

  // addAdvisor
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
      throw Error(
        `Advisor with email "${email}" already registered in the system`
      )
    }
    // add languages, regions, unavailable days at same time?
    return ctx.prisma.advisors.create({
      data: { email, first_name, last_name },
    })
  }

  //editAdvisor
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
        throw Error(
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
  @Mutation(() => Advisor)
  async removeAdvisor(
    @Ctx() ctx: Context,
    @Arg('advisor_id', () => Int) advisor_id: number
  ) {
    // reject if currently assigned workshops
    const hasWorkshops = await ctx.prisma.workshops.count({
      where: { assigned_advisor_id: advisor_id },
    })
    if (hasWorkshops) {
      throw Error(
        `Advisor #${advisor_id} cannot be deleted because this advisor currently has past or present workshops assigned`
      )
    }

    // reject if advisor has been requested
    const hasBeenRequested = await ctx.prisma.workshops.findFirst({
      where: {
        OR: [
          { requested_advisor_id: advisor_id },
          { backup_requested_advisor_id: advisor_id },
        ],
      },
    })
    if (hasBeenRequested) {
      throw Error(
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
    const removeUnavailableDays = ctx.prisma.unavailable_days.deleteMany({
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
      removeTheAdvisor,
    ]) //ctx.prisma.advisors.delete({ where: { email: advisorEmail } })
    return transaction[3]
  }
}
