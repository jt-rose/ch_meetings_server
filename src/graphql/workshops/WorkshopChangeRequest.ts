import { ObjectType, Field, Int } from 'type-graphql'
//import { Advisor } from '../advisors/Advisor'
//import { ChangeLog } from './WorkshopChangeLog'
//import { Client } from '../clients/Client'
//import { Course } from '../courses/Course'
import { Manager } from '../managers/Manager'
import { WorkshopSession } from './Session'
//import { WorkshopNote } from './WorkshopNote'
//import { Coursework } from '../courses/Coursework'
import { REGION } from '../enums/REGION'
import { SESSION_STATUS } from '../enums/SESSION_STATUS'
import { CHANGE_REQUEST_STATUS } from '../enums/CHANGE_REQUEST_STATUS'
import { WorkshopSessionChangeRequest } from './WorkshopSessionChangeRequest'

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

  @Field(() => Int, { nullable: true })
  class_size?: number

  @Field(() => Int)
  client_id: number

  @Field()
  open_air_id: string

  @Field()
  time_zone: string

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
  workshop_end_time?: Date

  @Field(() => SESSION_STATUS)
  workshop_status: SESSION_STATUS

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

  @Field(() => [WorkshopSession], { nullable: true })
  workshop_sessions_change_requests?: WorkshopSessionChangeRequest[]

  @Field(() => Manager)
  requestor: Manager
}
