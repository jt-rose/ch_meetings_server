import { ObjectType, Field, Int } from 'type-graphql'
import { Manager } from '../managers/Manager'
import { REGION } from '../enums/REGION'
import { WORKSHOP_STATUS } from '../enums/WORKSHOP_STATUS'
import { CHANGE_REQUEST_STATUS } from '../enums/CHANGE_REQUEST_STATUS'
import { TIME_ZONE } from '../enums/TIME_ZONES'
import { WorkshopSession } from './Session'

@ObjectType()
export class WorkshopChangeRequest {
  @Field(() => Int)
  workshop_change_request_id: number

  @Field(() => Int)
  workshop_id: number

  @Field(() => Int)
  course_id: number

  @Field()
  cohort_name: string

  @Field(() => Int, { nullable: true })
  requested_advisor_id?: number

  @Field(() => Int, { nullable: true })
  assigned_advisor_id?: number

  @Field()
  workshop_location: string

  @Field(() => REGION)
  workshop_region: REGION

  @Field(() => Int)
  class_size: number

  @Field(() => Int)
  client_id: number

  @Field()
  open_air_id: string

  @Field(() => TIME_ZONE)
  time_zone: TIME_ZONE

  // add validation
  @Field()
  workshop_language: string

  @Field()
  record_attendance: boolean

  @Field()
  in_person: boolean

  @Field()
  deleted: boolean

  @Field(() => Date)
  workshop_start_time: Date

  @Field(() => Date)
  workshop_end_time: Date

  @Field(() => WORKSHOP_STATUS)
  workshop_status: WORKSHOP_STATUS

  @Field()
  change_request_note: string

  @Field(() => CHANGE_REQUEST_STATUS)
  change_request_status: CHANGE_REQUEST_STATUS

  @Field(() => Int)
  requested_by: number

  @Field()
  requested_at: Date

  @Field()
  resolved_at: Date

  @Field()
  coordinator_request: boolean

  /* ----------------------------- field resolvers ---------------------------- */

  @Field(() => [WorkshopSession])
  change_request_sessions: WorkshopSession[]

  @Field(() => Manager)
  requestor: Manager
}
