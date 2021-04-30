import { Entity, Column, OneToMany } from 'typeorm'
import { Field, ObjectType, InputType } from 'type-graphql'
import { BaseUser } from './BASEUSER'
import { Workshop } from './WORKSHOP'

@ObjectType()
@Entity()
export class Advisor extends BaseUser {
  @Field(() => [Date])
  @Column()
  days_unavailable: Date[]

  @Field()
  @OneToMany(() => Workshop, (workshop) => workshop.advisor)
  workshops: Workshop
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
