import { Resolver, Arg, Ctx, Int, Mutation } from 'type-graphql'
import { AdvisorRegion } from '../objects/AdvisorRegion'
import { REGION } from '../enums/REGION'
import { Context } from '../../utils/context'
import { Authenticated } from '../../middleware/authChecker'

// Advisor regions are built around simple enums
// and will be read as a field resolver/ join on the Advisor data
// therefore, no read or update functionality is needed in this resolver

@Resolver(AdvisorRegion)
export class RegionResolver {
  @Authenticated()
  @Mutation(() => AdvisorRegion)
  async addAdvisorRegion(
    @Ctx() ctx: Context,
    @Arg('advisor_id', () => Int) advisor_id: number,
    @Arg('advisor_region', () => REGION) advisor_region: REGION
  ) {
    const alreadyRegistered = await ctx.prisma.regions.findFirst({
      where: { advisor_id, advisor_region },
    })

    if (alreadyRegistered) {
      return alreadyRegistered
    }
    return ctx.prisma.regions.create({ data: { advisor_id, advisor_region } })
  }

  @Authenticated()
  @Mutation(() => AdvisorRegion)
  async removeAdvisorRegion(
    @Ctx() ctx: Context,
    @Arg('region_id', () => Int) region_id: number
  ) {
    return ctx.prisma.regions.delete({ where: { region_id } })
  }
}
