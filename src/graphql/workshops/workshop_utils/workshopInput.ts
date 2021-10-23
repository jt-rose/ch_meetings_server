import { WORKSHOP_STATUS } from '../../enums/WORKSHOP_STATUS'
import { TIME_ZONE } from '../../enums/TIME_ZONES'
import { InputType, Field, Int } from 'type-graphql'
import { REGION } from '../../enums/REGION'
import { LICENSE_TYPE } from 'src/graphql/enums/LICENSE_TYPE'

// fields shared across creating / editing a workshop
@InputType()
class WorkshopInput {
  @Field(() => Int, { nullable: true })
  group_id?: number

  @Field()
  cohort_name: string

  @Field(() => Int, { nullable: true })
  requested_advisor_id: number | null

  @Field()
  workshop_location: string

  @Field(() => REGION)
  workshop_region: REGION

  @Field()
  class_size: number

  @Field()
  open_air_id: string

  @Field(() => TIME_ZONE)
  time_zone: TIME_ZONE

  @Field()
  workshop_language: string // enums/ validation

  @Field({ defaultValue: false })
  record_attendance: boolean

  @Field()
  in_person: boolean

  @Field()
  workshop_start_time: Date

  @Field()
  workshop_end_time: Date

  @Field(() => LICENSE_TYPE)
  license_type: LICENSE_TYPE

  //workshop_notes: {},
  //managers: {},
}

// user submitted fields when creating a new workshop
@InputType()
export class CreateWorkshopInput extends WorkshopInput {
  @Field()
  client_id: number

  @Field(() => Int)
  course_id: number
}

// user submitted fields when editing a workshop
@InputType()
export class EditWorkshopInput extends WorkshopInput {
  @Field(() => Int, { nullable: true })
  assigned_advisor_id: number | null

  @Field(() => WORKSHOP_STATUS)
  workshop_status: WORKSHOP_STATUS
}

/* -------------------------- validation functions -------------------------- */

// confirm valid language
// confirm requested advisors available on requested date(s)
