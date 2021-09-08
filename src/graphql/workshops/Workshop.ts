import { ObjectType, Field, Int, createUnionType } from 'type-graphql'
import { Advisor } from '../advisors/Advisor'
import { ChangeLog } from './WorkshopChangeLog'
import { Client } from '../clients/Client'
import { Course } from '../courses/Course'
import { Manager } from '../managers/Manager'
import { WorkshopSession } from './Session'
import { WorkshopNote } from './WorkshopNote'
import { Coursework } from '../courses/Coursework'
import { REGION } from '../enums/REGION'
import { WORKSHOP_STATUS } from '../enums/WORKSHOP_STATUS'
import { TIME_ZONE } from '../enums/TIME_ZONES'
import { TimeConflictError } from './workshop_utils/checkTimeConflicts'

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
  assigned_advisor_id: number

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
  participant_sign_up_link: string

  @Field()
  launch_participant_sign_ups: boolean

  /* ----------------------------- field resolvers ---------------------------- */

  @Field(() => [WorkshopSession])
  sessions: WorkshopSession[]

  @Field(() => Advisor, { nullable: true })
  assigned_advisor?: Advisor

  @Field(() => Advisor, { nullable: true })
  requested_advisor?: Advisor

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

// generate success / error union type when creating/ editing workshop
export const ValidatedWorkshopUnion = createUnionType({
  name: 'CreateWorkshopResult',
  types: () => [Workshop, TimeConflictError] as const,
  resolveType: (value) => {
    if ('timeConflicts' in value) {
      return TimeConflictError
    }
    if ('workshop_id' in value) {
      return Workshop
    }
    return undefined
  },
})
