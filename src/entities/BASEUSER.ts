import { Entity, PrimaryColumn, Column, BaseEntity } from 'typeorm'
import { Field, InputType, Int, ObjectType } from 'type-graphql'

@ObjectType()
@Entity()
export class BaseUser extends BaseEntity {
  @Field()
  @Column()
  first_name!: string

  @Field()
  @Column()
  last_name!: string

  // email will double as PK and username
  @Field()
  @PrimaryColumn()
  email!: string

  @Field(() => [Int])
  @Column()
  phone_numbers!: number[]

  @Field(() => [String])
  @Column()
  languages!: string[]

  @Field(() => [String])
  @Column()
  regions!: string[]

  @Field(() => [String])
  @Column()
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

  @Field(() => [Int])
  phone_numbers!: number[]

  @Field(() => [String])
  languages!: string[]

  @Field(() => [String])
  regions!: string[]

  @Field(() => [String])
  notes: string[]
}
