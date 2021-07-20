import { ObjectType, Field, Int } from 'type-graphql'
import { Advisor } from './Advisor'
import { ChangeLog } from './WorkshopChangeLog'
import { Client } from './Client'
import { Course } from './Course'
import { Manager } from './Manager'
import { WorkshopSession } from './Session'
import { WorkshopNote } from './WorkshopNote'
import { Coursework } from './Coursework'
import { REGION } from '../enums/REGION'
import { SESSION_STATUS } from '../enums/SESSION_STATUS'

@ObjectType()
export class Workshop {
  @Field(() => Int)
  workshop_id: number

  @Field(() => Int)
  group_id: number

  @Field(() => Int)
  created_by: number

  @Field(() => Date)
  created_at: Date

  @Field(() => Int)
  course_id: number

  @Field()
  cohort_name: string

  @Field(() => Int)
  requested_advisor_id: number

  @Field(() => Int)
  backup_requested_advisor_id: number

  @Field(() => Int)
  assigned_advisor_id: number

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
  workshop_start_date: Date

  @Field(() => Date)
  workshop_end_date: Date

  @Field(() => SESSION_STATUS)
  workshop_status: SESSION_STATUS

  @Field()
  participant_sign_up_link: string

  @Field()
  launch_participant_sign_ups: boolean

  /* ----------------------------- field resolvers ---------------------------- */

  @Field(() => [WorkshopSession])
  sessions: WorkshopSession[]

  @Field(() => Advisor, { nullable: true })
  assigned_advisor: Advisor

  @Field(() => Advisor)
  requested_advisor: Advisor

  @Field(() => Advisor, { nullable: true })
  backup_requested_advisor: Advisor

  @Field(() => Client)
  client: Client

  @Field(() => Course)
  course: Course

  @Field(() => [Manager])
  managers: Manager[]

  @Field(() => [WorkshopNote])
  workshop_notes: WorkshopNote[]

  @Field(() => [ChangeLog])
  change_log: ChangeLog[]

  @Field(() => [Coursework])
  coursework: Coursework[]
}
