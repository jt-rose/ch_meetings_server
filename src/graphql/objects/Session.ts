import { ObjectType, Field, Int } from 'type-graphql'
import { RequestedStartTime } from './SessionRequestedStartTime'
import { SessionNote } from './SessionNote'
import { SESSION_STATUS } from '../enums/SESSION_STATUS'

@ObjectType()
export class WorkshopSession {
  @Field(() => Int)
  workshop_session_id: number

  @Field()
  workshop_id: number

  @Field()
  session_name: string

  @Field(() => Date, { nullable: true })
  date_and_time: Date

  @Field(() => SESSION_STATUS)
  session_status: SESSION_STATUS

  @Field() // float
  duration_in_hours: number

  @Field({ nullable: true })
  zoom_link: string

  // field resolvers

  @Field(() => [RequestedStartTime])
  requested_start_times: RequestedStartTime[]

  @Field(() => [SessionNote])
  session_notes: SessionNote[]
}
