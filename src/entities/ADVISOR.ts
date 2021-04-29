import { Entity, Column } from 'typeorm'
import { Field, ObjectType } from 'type-graphql'
import { BaseUser } from './BASEUSER'

@ObjectType()
@Entity()
export class Advisor extends BaseUser {
  @Field(() => [Date])
  @Column()
  days_unavailable: Date[]

  // one to many for sessions
  // link to a user account so advisors can also sign in?
}
