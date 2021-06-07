import { ObjectType, Field, Int } from 'type-graphql'
import { RequestedStartTime } from './RequestedStartTime'
import { SessionNote } from './SessionNote'

@ObjectType()
export class WorkshopSession {
  @Field(() => Int)
  workshop_session_id: number

  @Field()
  workshop_id: number

  @Field(() => Date)
  session_date: Date

  @Field()
  start_time: string

  @Field()
  session_status: string // enum?

  @Field() // float
  duration_in_hours: number

  @Field()
  zoom_link: string

  // workshop field resolver - needed?

  @Field(() => [RequestedStartTime])
  requested_start_times: RequestedStartTime[]

  @Field(() => [SessionNote])
  session_notes: SessionNote[]
}
