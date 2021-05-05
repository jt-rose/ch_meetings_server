import { Field, InputType, Int, ObjectType } from 'type-graphql'
import { Workshop } from './WORKSHOP'

// separate sessions from session requests? or perhaps status?
// have single workshops table that links to individual sessions
// autogenerate comms template
// store config summaries in workshop table
// advisor/ user profile pic
// change log

@ObjectType()
export class Session {
  @Field(() => Int)
  session_id!: number

  workshop_id!: Workshop

  @Field(() => Date)
  date!: Date

  @Field(() => Date)
  start_time!: Date

  @Field(() => Date)
  end_time!: Date

  @Field()
  status!: string

  @Field()
  duration_in_hours!: number

  @Field()
  notes: string // text column

  @Field()
  zoom_link!: string

  @Field(() => [String])
  change_log!: string[]
}

/*
resolver functionality

request session - add to separate entity and link?
add session C
view session R
edit session U
delete session D
validate session
generate comms template
generate meetings planner
*/

@InputType()
export class SessionInput {}
