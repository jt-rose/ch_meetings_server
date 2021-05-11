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

  //getClient
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
  @Mutation(() => Client)
  async editClient(
    @Ctx() ctx: Context,
    @Arg('client_id', () => Int) client_id: number,
    @Arg('client_name', () => String) client_name: string,
    @Arg('business_unit', () => String, { nullable: true })
    business_unit?: string
  ) {
    return ctx.prisma.clients.update({
      where: { client_id },
      data: { client_name, business_unit },
    })
  } // Q: is undefined data ignored? or should bu be passed explicitly as null

  @Mutation(() => Client)
  async addClient(
    @Ctx() ctx: Context,
    @Arg('client_name', () => String) client_name: string,
    @Arg('business_unit', () => String, { nullable: true })
    business_unit?: string
  ) {
    const alreadyRegistered = await ctx.prisma.clients.count({
      where: { client_name, business_unit },
    })
    if (alreadyRegistered) {
      throw Error('This client has already been registered in the system')
    }
    return ctx.prisma.clients.create({ data: { client_name, business_unit } })
  }

  //addClient
  @Mutation(() => Client) // res-status
  async removeClient(
    @Arg('client_id', () => Int) client_id: number,
    @Ctx() ctx: Context
  ) {
    const hasWorkshops = await ctx.prisma.workshops.count({
      where: { client: client_id },
    })
    if (hasWorkshops) {
      throw Error(
        `Client #${client_id} cannot be deleted because this client currently has past or present workshops assigned`
      )
    }
    return ctx.prisma.clients.delete({ where: { client_id } })
  }
}
