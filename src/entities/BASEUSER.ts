import { Field, InputType, ObjectType } from 'type-graphql'

@ObjectType()
export class BaseUser {
  @Field()
  first_name!: string

  @Field()
  last_name!: string

  // email will double as PK and username
  @Field()
  email!: string

  /*
  @Field(() => [Int])
  @Column()
  phone_numbers!: number[]
*/
  @Field(() => [String])
  languages!: string[]

  @Field(() => [String])
  regions!: string[]

  @Field(() => [String])
  notes: string[]
}

// to avoid potential conflicts
@InputType()
export class BaseUserInput {
  @Field()
  first_name!: string

  @Field()
  last_name!: string

  // email will double as PK and username
  @Field(() => String)
  email!: string

  /*
  @Field(() => [Int])
  phone_numbers!: number[]
*/
  @Field(() => [String])
  languages!: string[]

  @Field(() => [String])
  regions!: string[]

  @Field(() => [String])
  notes: string[]
}
