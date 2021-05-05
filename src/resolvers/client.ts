import { Resolver, Arg, /*Query*/ Mutation } from 'type-graphql'
import { Client, ClientInput } from '../entities/CLIENT'

@Resolver(Client)
export class ClientResolver {
  @Mutation(() => String)
  async createClient(
    @Arg('clientInfo', () => ClientInput) clientInfo: ClientInput
  ): /*Promise<Client>*/ Promise<string> {
    return ''
  }
  /*
  @Mutation()
  async editClient() {}

  @Query()
  async findClient() {}

  @Mutation()
  async deleteClient() {}*/
}
