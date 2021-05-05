import { Field, Int, ObjectType } from 'type-graphql'
import { Advisor } from './ADVISOR'
import { Client } from './CLIENT'
import { Session } from './SESSION'

@ObjectType()
export class Workshop {
  @Field(() => Int)
  workshop_id!: number

  @Field()
  course_type!: string // enum later

  advisor!: Advisor

  @Field()
  conference_type!: string // change to enum later, ex: in_person, zoom, teams, etc.

  @Field(() => [Session])
  sessions!: Session[]
  // breakout to sess1, sess2

  client!: Client

  @Field()
  business_unit: string

  @Field()
  open_air_id!: string

  @Field()
  status!: string // change to enum later

  @Field()
  time_zone!: string

  @Field()
  language!: string

  @Field()
  record_attendance!: boolean

  @Field(() => [String])
  client_success_team!: string[] // change to user FK?

  @Field(() => [String])
  sales_team!: string[]

  @Field(() => [String])
  change_log: string[] // may change to jsonb later

  @Field()
  config_summary: string // change to doc type later

  @Field(() => [String])
  notes: string[]
}
