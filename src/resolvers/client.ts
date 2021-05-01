import { Resolver, Arg, Query, Mutation } from 'type-graphql'
import { Client, ClientInput } from '../entities/CLIENT'

@Resolver()
export class ClientResolver {
  @Query()
  async createClient(
    @Arg('clientInfo', () => ClientInput) clientInfo: ClientInput
  ) {}
}
