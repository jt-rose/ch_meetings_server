import { Context } from '../../utils/context'
import {
  Resolver,
  FieldResolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  Root,
  Int,
} from 'type-graphql'
import { Authenticated } from '../../middleware/authChecker'
import { Workshop } from './Workshop'
import { WorkshopGroup } from './WorkshopGroup'
import { CustomError } from '../../middleware/errorHandler'

@Resolver(WorkshopGroup)
export class WorkshopGroupResolver {
  /* ----------------------------- field resolvers ---------------------------- */
  @FieldResolver(() => Workshop)
  workshops(@Ctx() ctx: Context, @Root() workshop_group: WorkshopGroup) {
    return ctx.prisma.workshop_groups
      .findUnique({ where: { group_id: workshop_group.group_id } })
      .workshops()
  }

  /* ----------------------------- CRUD operations ---------------------------- */

  @Authenticated()
  @Query(() => WorkshopGroup)
  getWorkshopGroup(
    @Ctx() ctx: Context,
    @Arg('group_id', () => Int) group_id: number
  ) {
    return ctx.prisma.workshop_groups.findFirst({ where: { group_id } })
  }

  // add filter/ sort/ pagination later?
  @Authenticated()
  @Query(() => [WorkshopGroup])
  getAllWorkshopGroups(@Ctx() ctx: Context) {
    return ctx.prisma.workshop_groups.findMany()
  }

  // add workshop group, and optionally assign workshops at same time
  @Authenticated()
  @Mutation(() => WorkshopGroup)
  async addWorkshopGroup(
    @Ctx() ctx: Context,
    @Arg('group_name') group_name: string,
    @Arg('group_description', { nullable: true })
    group_description: string,
    @Arg('workshop_ids', () => [Int])
    workshop_ids: number[]
  ) {
    /*
    // reject if name already taken
    const nameAlreadyTaken = await ctx.prisma.workshop_groups.findFirst({
      where: { group_name },
    })
    if (nameAlreadyTaken) {
      throw new CustomError(`Group name ${group_name} already in use!`)
    }
    */
    // reject if workshop not found
    if (workshop_ids) {
      const workshops = await ctx.prisma.workshops.findMany({
        where: { workshop_id: { in: workshop_ids } },
      })

      if (workshops.length !== workshop_ids.length) {
        // get workshop IDs without matching workshops
        const missingIDs = workshops
          .map((ws) => ws.workshop_id)
          .filter((wsid) => !workshop_ids.includes(wsid))
        // throw new CustomError referencing missing IDs
        throw new CustomError(
          `No matching workshop found for workshop ID: ${missingIDs}`
        )
      }
    }

    // create group and add optional members
    return ctx.prisma.workshop_groups.create({
      data: {
        group_name,
        group_description,
        created_by: ctx.req.session.manager_id!,
        workshops: {
          connect: workshop_ids.map((wsid) => ({ workshop_id: wsid })),
        },
      },
    })
  }

  // assign workshop to workshop group
  @Authenticated()
  @Mutation(() => Workshop)
  async assignWorkshopToWorkshopGroup(
    @Ctx() ctx: Context,
    @Arg('workshop_id', () => Int) workshop_id: number,
    @Arg('group_id', () => Int) group_id: number
  ) {
    const workshopGroup = await ctx.prisma.workshop_groups.findFirst({
      where: { group_id },
    })
    if (!workshopGroup) {
      throw new CustomError('No such Workshop Group found!')
    }

    return ctx.prisma.workshops.update({
      where: { workshop_id },
      data: {
        group_id,
        workshop_change_log: {
          create: {
            note: `assigned to workshop group "${workshopGroup.group_name}"`,
            created_by: ctx.req.session.manager_id!,
            created_at: new Date(),
          },
        },
      },
    })
  }

  // remove workshop from workshop group
  @Authenticated()
  @Mutation(() => WorkshopGroup)
  removeWorkshopFromWorkshopGroup(
    @Ctx() ctx: Context,
    @Arg('workshop_id', () => Int) workshop_id: number
  ) {
    return ctx.prisma.workshops.update({
      where: { workshop_id },
      data: {
        group_id: null,
        workshop_change_log: {
          create: {
            note: `removed from workshop group`,
            created_by: ctx.req.session.manager_id!,
            created_at: new Date(),
          },
        },
      },
    })
  }

  // edit workshop group name
  @Authenticated()
  @Mutation(() => WorkshopGroup)
  async editWorkshopGroup(
    @Ctx() ctx: Context,
    @Arg('group_id', () => Int) group_id: number,
    @Arg('group_name') group_name: string,
    @Arg('group_description', { nullable: true })
    group_description: string
  ) {
    const workshopGroups = await ctx.prisma.workshop_groups.findMany({
      where: { OR: [{ group_id }, { group_name }] },
    })
    if (workshopGroups.every((group) => group.group_id !== group_id)) {
      throw new CustomError('No such workshop group found!')
    }

    if (workshopGroups.find((group) => group.group_name === group_name)) {
      throw new CustomError(`Group name \"${group_name}\" already in use!`)
    }

    return ctx.prisma.workshop_groups.update({
      where: { group_id },
      data: { group_name, group_description },
    })
  }

  // remove workshop group and unassign workshops
  @Authenticated()
  @Mutation(() => WorkshopGroup)
  async removeWorkshopGroup(
    @Ctx() ctx: Context,
    @Arg('group_id', () => Int) group_id: number
  ) {
    // get workshops affected to reference when creating change logs
    const groupsAndWorkshops = await ctx.prisma.workshop_groups.findFirst({
      where: { group_id },
      include: { workshops: true },
    })

    // reject if no workshop group found
    if (!groupsAndWorkshops) {
      throw new CustomError('No such workshop group found!')
    }

    const changeLogUpdates = groupsAndWorkshops.workshops.map((workshop) => ({
      note: '',
      workshop_id: workshop.workshop_id,
      created_by: ctx.req.session.manager_id!,
      created_at: new Date(),
    }))

    // batch sql queries to run in transaction and update all tables

    // update workshops in group to make group id null
    const removeWorkshopsFromGroup = ctx.prisma.workshops.updateMany({
      where: { group_id },
      data: {
        group_id: null,
      },
    })

    // add change logs
    const addChangeLogs = ctx.prisma.workshop_change_log.createMany({
      data: changeLogUpdates,
    })

    // delete workshop group
    const removeWorkshopGroup = ctx.prisma.workshop_groups.delete({
      where: { group_id },
    })

    // run all updates in a transaction
    const result = await ctx.prisma.$transaction([
      removeWorkshopsFromGroup,
      addChangeLogs,
      removeWorkshopGroup,
    ])

    return result[0]
  }
}
