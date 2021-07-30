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
import { AdvisorLanguage } from './AdvisorLanguage'
import { Advisor } from './Advisor'
import { Context } from '../../utils/context'
import { languageList } from '../../utils/languageList'
import { Authenticated } from '../../middleware/authChecker'

@Resolver(AdvisorLanguage)
export class LanguageResolver {
  /* ----------------------------- field resolvers ---------------------------- */
  @FieldResolver(() => Advisor)
  async advisor(@Ctx() ctx: Context, @Root() advisorLanguage: AdvisorLanguage) {
    return ctx.prisma.languages
      .findUnique({
        where: { language_id: advisorLanguage.language_id },
      })
      .advisors()
  }
  /* ------------------------- Advisor_languages CRUD ------------------------- */

  // addAdvisorLanguage
  @Authenticated()
  @Mutation(() => AdvisorLanguage)
  async addAdvisorLanguage(
    @Ctx() ctx: Context,
    @Arg('advisor_id') advisor_id: number,
    @Arg('language') language: string
  ) {
    if (!languageList.includes(language)) {
      throw Error('Please submit a valid language')
    }
    return ctx.prisma.languages.create({
      data: { advisor_id, advisor_language: language },
    })
  }

  // removeAdvisorLanguage
  @Authenticated()
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
  @Authenticated()
  @Query(() => [AdvisorLanguage])
  async getAllAdvisorLanguages(
    @Ctx() ctx: Context,
    @Arg('language', { nullable: true }) language?: string
  ) {
    // prisma accepts undefined, not null
    // for 'where' properties, so this will be adjusted
    return ctx.prisma.languages.findMany({
      where: { advisor_language: language || undefined },
    })
  }
}
