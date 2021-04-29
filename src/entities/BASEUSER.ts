import { Entity, PrimaryColumn, Column, BaseEntity } from 'typeorm'
import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
@Entity()
export class BaseUser extends BaseEntity {
  @Field(() => String)
  @Column()
  first_name!: string

  @Field(() => String)
  @Column()
  last_name!: string

  // email will double as PK and username
  @Field(() => String)
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
