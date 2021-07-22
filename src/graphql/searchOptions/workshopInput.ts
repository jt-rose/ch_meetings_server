import { InputType, Field, Int } from 'type-graphql'
import { REGION } from '../enums/REGION'

// user submitted fields when creating a new workshop
@InputType()
export class CreateWorkshopInput {
  @Field(() => Int, { nullable: true })
  group_id?: number

  @Field(() => Int)
  course_id: number

  @Field()
  cohort_name: string // add unique validation

  @Field(() => Int)
  requested_advisor_id: number

  @Field(() => Int, { nullable: true })
  backup_requested_advisor_id?: number

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

@InputType()
export class EditWorkshopInput {
  @Field(() => Int, { nullable: true })
  assigned_advisor_id: number
}

/* -------------------------- validation functions -------------------------- */

// confirm valid language
// confirm requested advisors available on requested date(s)
