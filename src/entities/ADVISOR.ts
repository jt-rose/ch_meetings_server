import { Entity, Column } from 'typeorm'
import { Field, ObjectType, InputType } from 'type-graphql'
import { BaseUser, BaseUserInput } from './BASEUSER'

@ObjectType()
@Entity()
export class Advisor extends BaseUser {
  @Field(() => [Date])
  @Column()
  days_unavailable: Date[]

  // one to many for sessions
  // link to a user account so advisors can also sign in?
}

// input type
@InputType()
export class AdvisorDaysOff {
  @Field()
  advisor_id!: string

  @Field(() => [Date])
  days_unavailable!: Date[]
}
