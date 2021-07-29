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
import { Client } from '../objects/Client'
import { ClientNote } from '../objects/ClientNote'
import { AvailableLicense } from '../objects/AvailableLicense'
import { Workshop } from '../objects/Workshop'

@Resolver(Client)
export class ClientResolver {
  /* ----------------------------- field resolvers ---------------------------- */
  @FieldResolver(() => [ClientNote])
  client_notes(@Ctx() ctx: Context, @Root() root: Client) {
    return ctx.prisma.clients
      .findUnique({ where: { client_id: root.client_id } })
      .client_notes()
  }

  @FieldResolver(() => [AvailableLicense])
  licenses(@Ctx() ctx: Context, @Root() root: Client) {
    return ctx.prisma.clients
      .findUnique({ where: { client_id: root.client_id } })
      .available_licenses()
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
      throw Error(
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
      throw Error('This client has already been registered in the system')
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
      include: { workshops: true, available_licenses: true },
    })

    // reject if no client found
    if (!clientAndWorkshops) {
      throw Error(`Client not found in database`)
    }
    // reject if client has workshops scheduled, past or present
    if (clientAndWorkshops.workshops.length > 0) {
      throw Error(
        'Cannot remove client with past or present workshops assigned'
      )
    }

    // reject if outstanding licenses
    if (
      clientAndWorkshops.available_licenses.find(
        (x) => x.remaining_amount !== 0
      )
    ) {
      throw Error('Cannot remove client with outstanding licenses')
    }

    // safe to delete if client present but without workshops/ licenses
    // transaction used to remove all related fields together
    const licenseIDs = clientAndWorkshops.available_licenses.map(
      (x) => x.license_id
    )

    const removeLicenseChanges = ctx.prisma.license_changes.deleteMany({
      where: { license_id: { in: licenseIDs } },
    })
    const removeLicenses = ctx.prisma.available_licenses.deleteMany({
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
      const hasActiveWorkshops = clientWorkshops
        .flatMap((x) => x.workshop_sessions)
        .some((session) => session.session_status !== 'COMPLETED')
      if (hasActiveWorkshops) {
        throw Error(
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
