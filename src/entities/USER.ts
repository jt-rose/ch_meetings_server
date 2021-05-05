import { Field, ObjectType, InputType } from 'type-graphql'
import { BaseUser, BaseUserInput } from './BASEUSER'

@ObjectType()
export class User extends BaseUser {
  @Field(() => String)
  position!: string

  @Field(() => String)
  department!: string

  @Field(() => String)
  permissions!: string // replace with enums

  // don't share publicly
  password!: string

  // one to many for sessions
  // link to a user account so advisors can also sign in?
}

// input type for User
@InputType()
export class UserInput extends BaseUserInput {
  @Field(() => String)
  position!: string

  @Field(() => String)
  department!: string

  @Field(() => String)
  permissions!: string // replace with enums

  // available as an input for generating user, but not an exposed field object
  @Field()
  password!: string

  // one to many for sessions
  // link to a user account so advisors can also sign in?
}
