import {
  Resolver,
  //Ctx,
  //Arg,
  Mutation,
  //Field,
  //ObjectType,
  Query,
  //Root,
  //FieldResolver,
} from 'type-graphql'
import { Advisor } from '../entities/ADVISOR'

/* ---------------------------- advisor resolver ---------------------------- */

@Resolver(Advisor)
export class AdvisorResolver {
  @Mutation(() => Advisor)
  async createAdvisor() {
    console.log('hello apollo')
  }

  @Query(() => Advisor)
  async findAdvisor() {
    console.log('hello apollo')
  }

  @Mutation(() => Advisor)
  async editAdvisor() {
    console.log('hello apollo')
  }

  @Mutation(() => Advisor)
  async deleteAdvisor() {
    console.log('hello apollo')
  }
}
