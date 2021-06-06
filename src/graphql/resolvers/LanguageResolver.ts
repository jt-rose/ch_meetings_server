import {
  Resolver,
  FieldResolver,
  Query,
  Mutation,
  Int,
  Arg,
  Ctx,
  Root,
} from 'type-graphql'
import { AdvisorLanguage } from '../objects/Languages'
import { Advisor } from '../objects/Advisor'
import { Context } from './../../utils/context'

@Resolver(AdvisorLanguage)
export class LanguageResolver {
  @FieldResolver(() => Advisor)
  async advisor(@Ctx() ctx: Context, @Root() advisorLanguage: AdvisorLanguage) {
    return ctx.prisma.advisors.findFirst({
      where: { advisor_id: advisorLanguage.advisor_id },
    })
  }

  // addAdvisorLanguage
  @Mutation(() => AdvisorLanguage)
  async addAdvisorLanguage(
    @Ctx() ctx: Context,
    @Arg('advisor_id') advisor_id: number,
    @Arg('language') language: string
  ) {
    //add validation
    return ctx.prisma.languages.create({
      data: { advisor_id, advisor_language: language },
    })
  }

  // removeAdvisorLanguage
  @Mutation(() => AdvisorLanguage)
  async removeAdvisorLanguage(
    @Ctx() ctx: Context,
    @Arg('language_id', () => Int) language_id: number
  ) {
    return ctx.prisma.languages.delete({ where: { language_id } })
  }
  // no resolver endpoint is needed for reading single AdvisorLanguage objects
  // as this functionality will be handled by a field resolver
  // on the Advisor Resolver
  // getAllAdvisorLanguages - nullable where
  @Query(() => [AdvisorLanguage])
  async getAllAdvisorLanguages(
    @Ctx() ctx: Context,
    @Arg('language', { nullable: true }) language?: string
  ) {
    return ctx.prisma.languages.findMany({
      where: { advisor_language: language },
    })
  }
  // getUniqueLanguages
  @Query(() => [AdvisorLanguage])
  async getUniqueAdvisorLanguages(@Ctx() ctx: Context) {
    return ctx.prisma.$queryRaw(`
        SELECT DISTINCT advisor_language FROM languages
        `)
  }
  //
}
