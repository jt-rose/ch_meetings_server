import {
  Resolver,
  /*FieldResolver,*/ Query,
  Mutation,
  Ctx,
  Arg,
  /*Root,*/ Int,
} from 'type-graphql'
import { Context } from '../../utils/context'
import { Client } from '../objects/Client'

@Resolver(Client)
export class ClientResolver {
  //@FieldResolver() workshops

  //use dataloader
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
    return ctx.prisma.clients.create({ data: { client_name, business_unit } })
  }

  //addClient
  @Mutation(() => Client)
  async removeClient(
    @Arg('client_id', () => Int) client_id: number,
    @Ctx() ctx: Context
  ) {
    // search for client and related workshops
    const clientAndWorkshops = await ctx.prisma.clients.findFirst({
      where: { client_id },
      include: { workshops: true },
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
    // safe to delete if client present but without workshops
    return ctx.prisma.clients.delete({ where: { client_id } })
  }
}
