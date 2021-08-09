import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
export class AdvisorUnavailableTime {
  @Field(() => Int)
  unavailable_id: number

  @Field(() => Int)
  advisor_id: number

  @Field(() => Date)
  unavailable_start_time: Date

  @Field(() => Date)
  unavailable_end_time: Date

  @Field(() => String, { nullable: true })
  note?: string
}
