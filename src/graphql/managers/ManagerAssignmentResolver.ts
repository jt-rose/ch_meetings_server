import { Resolver, Ctx, Arg, Int, Mutation } from 'type-graphql'
import { ManagerAssignment } from './ManagerAssignment'
import { Context } from '../../utils/context'

@Resolver(ManagerAssignment)
export class ManagerAssignmentsResolver {
  @Mutation(() => ManagerAssignment)
  async addManagerToWorkshop(
    @Ctx() ctx: Context,
    @Arg('manager_id', () => Int) manager_id: number,
    @Arg('workshop_id', () => Int) workshop_id: number
  ) {
    const alreadyAssigned = await ctx.prisma.manager_assignments.findFirst({
      where: { manager_id, workshop_id },
    })
    if (alreadyAssigned?.active) {
      return alreadyAssigned
    }
    if (alreadyAssigned) {
      return ctx.prisma.manager_assignments.update({
        where: { assignment_id: alreadyAssigned.assignment_id },
        data: { active: true },
      })
    }
    return ctx.prisma.manager_assignments.create({
      data: {
        manager_id,
        workshop_id,
        active: true,
      },
    })
  }

  @Mutation(() => ManagerAssignment)
  removeManagerFromWorkshop(
    @Ctx() ctx: Context,
    @Arg('assignment_id', () => Int) assignment_id: number
  ) {
    return ctx.prisma.manager_assignments.delete({ where: { assignment_id } })
  }

  @Mutation(() => ManagerAssignment)
  changeManagerAssignmentStatus(
    @Ctx() ctx: Context,
    @Arg('assignment_id', () => Int) assignment_id: number,
    @Arg('active') active: boolean
  ) {
    return ctx.prisma.manager_assignments.update({
      where: { assignment_id },
      data: { active },
    })
  }
}
