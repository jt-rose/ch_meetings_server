import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
export class RequestedStartTime {
  @Field(() => Int)
  request_id: number

  @Field(() => Int)
  workshop_session_id: number

  @Field(() => Date)
  earliest_start_time: Date

  @Field(() => Date)
  latest_start_time: Date
}
