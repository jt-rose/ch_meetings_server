import { InputType, Field, Int } from 'type-graphql'
import { nanoid } from 'nanoid'
import { REGION } from '../enums/REGION'
import { SESSION_STATUS } from '../enums/SESSION_STATUS'

// user submitted fields when creating a new workshop
@InputType()
export class CreateWorkshopInput {
  @Field(() => Int, { nullable: true })
  group_id?: number

  @Field()
  course_id: number

  @Field()
  cohort_name: string // add unique validation

  @Field()
  requested_advisor_id: number

  @Field()
  backup_requested_advisor_id: number

  @Field()
  assigned_advisor_id: number

  @Field()
  workshop_location: string

  @Field(() => REGION)
  workshop_region: REGION

  @Field()
  class_size: number

  @Field()
  client_id: number

  @Field()
  open_air_id: string

  @Field()
  time_zone: string

  @Field()
  workshop_language: string // enums/ validation

  @Field({ defaultValue: false })
  record_attendance: boolean

  @Field()
  in_person: boolean

  @Field()
  workshop_start_date: Date

  @Field()
  workshop_end_date: Date

  //workshop_sessions: {},
  //workshop_notes: {},
  //managers: {},
}

// take user submitted fields and add server-generated fields
export const formatCreateWorkshopInput = (
  createWorkshopInput: CreateWorkshopInput
) => {
  return {
    // apply user submitted fields
    ...createWorkshopInput,
    // set up server generated defaults
    workshop_status: SESSION_STATUS.REQUESTED,
    deleted: false,
    participant_sign_up_link: nanoid(),
    // password for sign_up_link?
    launch_participant_sign_ups: false,
  }
}

@InputType()
export class EditWorkshopInput {}

/* -------------------------- validation functions -------------------------- */

// confirm valid language
// confirm requested advisors available on requested date(s)
