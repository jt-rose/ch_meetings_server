import { ObjectType, Field, Int } from 'type-graphql'
import { SESSION_STATUS } from '../enums/SESSION_STATUS'
import { CHANGE_REQUEST_STATUS } from '../enums/CHANGE_REQUEST_STATUS'

@ObjectType()
export class WorkshopSessionChangeRequest {
  @Field(() => Int)
  workshop_session_change_request_id: number

  @Field(() => Int, { nullable: true })
  workshop_change_request_id?: number

  @Field(() => Int)
  workshop_id: number

  @Field(() => Int)
  workshop_session_id: number

  @Field()
  session_name: string

  @Field()
  start_time: Date

  @Field()
  end_time: Date

  @Field()
  session_status: SESSION_STATUS

  @Field({ nullable: true })
  meeting_link?: string

  // change request data

  @Field()
  change_request_note: string

  @Field(() => CHANGE_REQUEST_STATUS)
  change_request_status: CHANGE_REQUEST_STATUS

  @Field(() => Int)
  requested_by: number

  @Field()
  requested_at: Date

  @Field({ nullable: true })
  resolved_at?: Date

  @Field()
  coordinator_request: boolean
}
