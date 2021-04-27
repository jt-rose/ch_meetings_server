import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'
import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => String)
  @Column()
  first_name!: string

  @Field(() => String)
  @Column()
  last_name!: string

  @Field(() => String)
  @Column()
  position!: string

  @Field(() => String)
  @Column()
  department!: string

  @Field(() => String)
  @Column()
  permissions!: string // replace with enums

  // email will double as username
  @Field(() => String)
  @Column({ unique: true })
  email!: string

  // don't share publicly
  @Column()
  password!: string

  // store phone numbers?
  @Field(() => [Int])
  @Column()
  phone_numbers!: number[]

  @Field(() => [String])
  @Column()
  languages!: string[]

  // remove?
  @Field(() => [String])
  @Column()
  regions!: string[]

  @Field(() => [String])
  @Column()
  notes: string[]

  // one to many for sessions
  // link to a user account so advisors can also sign in?
}
