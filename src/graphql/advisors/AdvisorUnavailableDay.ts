import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
export class AdvisorUnavailableDay {
  @Field(() => Int)
  unavailable_id: number

  @Field(() => Int)
  advisor_id: number

  @Field(() => Date)
  day_unavailable: Date

  @Field(() => String, { nullable: true })
  note?: string
}
