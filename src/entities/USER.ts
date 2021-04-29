import { Entity, Column } from 'typeorm'
import { Field, ObjectType } from 'type-graphql'
import { BaseUser } from './BASEUSER'

@ObjectType()
@Entity()
export class User extends BaseUser {
  @Field(() => String)
  @Column()
  position!: string

  @Field(() => String)
  @Column()
  department!: string

  @Field(() => String)
  @Column()
  permissions!: string // replace with enums

  // don't share publicly
  @Column()
  password!: string

  // one to many for sessions
  // link to a user account so advisors can also sign in?
}
