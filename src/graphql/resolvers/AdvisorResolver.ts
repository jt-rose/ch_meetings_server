import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql'
import { Advisor } from '../objects/Advisor'
import { Context } from '../../utils/context'

@Resolver(Advisor)
export class AdvisorResolver {
  // workshops - field resolver
  // unavailable_days - field resolver
  // regions - field resolver
  // languages - field resolver

  // getAdvisor
  // refactor later with dataloader
  @Query(() => Advisor)
  async getAdvisor(
    @Ctx() ctx: Context,
    @Arg('advisorEmail', () => String) advisorEmail: string
  ) {
    return ctx.prisma.advisors.findFirst({ where: { email: advisorEmail } })
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
    // can prisma do it in one go?
    // if so, that's pretty slick
    return ctx.prisma.advisors.create({
      data: { email, first_name, last_name },
    })
  }

  //editAdvisor
  @Mutation(() => Advisor)
  async editAdvisor(
    @Ctx() ctx: Context,
    @Arg('currentEmail', () => String) currentEmail: string,
    @Arg('updatedEmail', () => String, { nullable: true }) updatedEmail: string,
    @Arg('first_name', () => String, { nullable: true }) first_name: string,
    @Arg('last_name', () => String, { nullable: true }) last_name: string
  ) {
    // check that new email not in use
    if (updatedEmail) {
      const currentlyUsed = await ctx.prisma.advisors.count({
        where: { email: updatedEmail },
      })
      if (currentlyUsed) {
        throw Error(
          `Email "${updatedEmail}" is already registered as an advisor in our system`
        )
      }
    }
    // cascade update if new email
    // based on prisma docs, relations should update and undefined should be ignored
    // but need to test
    return ctx.prisma.advisors.update({
      where: { email: currentEmail },
      data: { email: updatedEmail, first_name, last_name },
    })
  }

  // removeAdvisor
  @Mutation(() => Advisor)
  async removeAdvisor(
    @Ctx() ctx: Context,
    @Arg('advisorEmail', () => String) advisorEmail: string
  ) {
    const hasWorkshops = await ctx.prisma.workshops.count({
      where: { assigned_advisor: advisorEmail },
    })
    if (hasWorkshops) {
      throw Error(
        `Advisor ${advisorEmail} cannot be deleted because this advisor currently has past or present workshops assigned`
      )
    }

    // set up parts of a transaction to run a cascading delete
    const removeLanguages = ctx.prisma.languages.deleteMany({
      where: { advisor: advisorEmail },
    })
    const removeRegions = ctx.prisma.regions.deleteMany({
      where: { advisor: advisorEmail },
    })
    const removeUnavailableDays = ctx.prisma.unavailable_days.deleteMany({
      where: { advisor: advisorEmail },
    })
    const removeTheAdvisor = ctx.prisma.advisors.delete({
      where: { email: advisorEmail },
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
