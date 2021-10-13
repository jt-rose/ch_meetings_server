import {
  Resolver,
  FieldResolver,
  Query,
  Mutation,
  Ctx,
  Arg,
  Root,
  Int,
} from 'type-graphql'
import { Context } from '../../utils/context'
import { Client } from './Client'
import { ClientNote } from './ClientNote'
import { License } from '../licenses/License'
import { Workshop } from '../workshops/Workshop'
import { CustomError } from '../../middleware/errorHandler'

@Resolver(Client)
export class ClientResolver {
  /* ----------------------------- field resolvers ---------------------------- */
  @FieldResolver(() => [ClientNote])
  client_notes(@Ctx() ctx: Context, @Root() root: Client) {
    return ctx.prisma.clients
      .findUnique({ where: { client_id: root.client_id } })
      .client_notes()
  }

  @FieldResolver(() => [License])
  licenses(@Ctx() ctx: Context, @Root() root: Client) {
    return ctx.prisma.clients
      .findUnique({ where: { client_id: root.client_id } })
      .licenses()
  }

  @FieldResolver(() => [Workshop])
  workshops(@Ctx() ctx: Context, @Root() root: Client) {
    return ctx.prisma.clients
      .findUnique({ where: { client_id: root.client_id } })
      .workshops()
  }

  /* ----------------------------- CRUD Operations ---------------------------- */
  @Query(() => Client, { nullable: true })
  async getClient(
    @Arg('client_id', () => Int) client_id: number,
    @Ctx() ctx: Context
  ) {
    return ctx.prisma.clients.findUnique({ where: { client_id } })
  }

  @Query(() => [Client], { nullable: true })
  async getAllClients(@Ctx() ctx: Context) {
    // add pagination?
    return ctx.prisma.clients.findMany()
  }

  //editClient
  // not passing an argument for business_unit will leave it unchanged
  @Mutation(() => Client)
  async editClient(
    @Ctx() ctx: Context,
    @Arg('client_id', () => Int) client_id: number,
    @Arg('client_name', () => String) client_name: string,
    @Arg('business_unit', () => String, { nullable: true })
    business_unit?: string
  ) {
    const nameInUse = await ctx.prisma.clients.findFirst({
      where: { client_name, business_unit },
    })
    if (nameInUse) {
      throw new CustomError(
        `client "${client_name}" with business unit "${business_unit}" is already registered in the system`
      )
    }
    return ctx.prisma.clients.update({
      where: { client_id },
      data: { client_name, business_unit },
    })
  }

  @Mutation(() => Client)
  async addClient(
    @Ctx() ctx: Context,
    @Arg('client_name', () => String) client_name: string,
    @Arg('business_unit', () => String, { nullable: true })
    business_unit?: string
  ) {
    const alreadyRegistered = await ctx.prisma.clients.findFirst({
      where: { client_name, business_unit },
    })
    if (alreadyRegistered) {
      throw new CustomError(
        'This client has already been registered in the system'
      )
    }
    return ctx.prisma.clients.create({
      data: {
        client_name,
        business_unit,
        created_by: ctx.req.session.manager_id!,
      },
    })
  }

  // removing client should only be done when no work has been completed
  @Mutation(() => Client)
  async removeClient(
    @Arg('client_id', () => Int) client_id: number,
    @Ctx() ctx: Context
  ) {
    // search for client and related workshops
    const clientAndWorkshops = await ctx.prisma.clients.findFirst({
      where: { client_id },
      include: { workshops: true, licenses: true },
    })

    // reject if no client found
    if (!clientAndWorkshops) {
      throw new CustomError(`Client not found in database`)
    }
    // reject if client has workshops scheduled, past or present
    if (clientAndWorkshops.workshops.length) {
      throw new CustomError(
        'Cannot remove client with past or present workshops assigned'
      )
    }

    // reject if past or present licenses present
    if (clientAndWorkshops.licenses.length) {
      throw new CustomError('Cannot remove client with outstanding licenses')
    }

    // safe to delete if client present but without workshops/ licenses
    // transaction used to remove all related fields together
    const licenseIDs = clientAndWorkshops.licenses.map((x) => x.license_id)

    const removeLicenseChanges = ctx.prisma.license_changes.deleteMany({
      where: { license_id: { in: licenseIDs } },
    })
    const removeLicenses = ctx.prisma.licenses.deleteMany({
      where: { client_id },
    })
    const removeClientNotes = ctx.prisma.client_notes.deleteMany({
      where: { client_id },
    })
    const removeClientAssignments = ctx.prisma.manager_clients.deleteMany({
      where: { client_id },
    })
    const removeClient = ctx.prisma.clients.delete({ where: { client_id } })

    const removeClientAndRelations = await ctx.prisma.$transaction([
      removeLicenseChanges,
      removeLicenses,
      removeClientNotes,
      removeClientAssignments,
      removeClient,
    ])

    return removeClientAndRelations[4]
  }
  @Mutation(() => Client)
  async changeClientActiveStatus(
    @Ctx() ctx: Context,
    @Arg('client_id', () => Int) client_id: number,
    @Arg('active') active: boolean
  ) {
    if (!active) {
      const clientWorkshops = await ctx.prisma.workshops.findMany({
        where: { client_id },
        include: { workshop_sessions: true },
      })
      const hasActiveWorkshops = clientWorkshops.some(
        (workshop) =>
          workshop.workshop_status !== 'COMPLETED' &&
          workshop.workshop_status !== 'CANCELLED'
      )
      if (hasActiveWorkshops) {
        throw new CustomError(
          'Client cannot be deactivated as they have upcoming workshops scheduled'
        )
      }
    }

    return ctx.prisma.clients.update({
      where: { client_id },
      data: { active },
    })
  }
}
