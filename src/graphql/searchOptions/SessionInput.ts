import { InputType, Field } from 'type-graphql'
import { SESSION_STATUS } from '../enums/SESSION_STATUS'

// user input for creating a session
// the workshop_id, session status,, and created_at/ created_by info
// will be generated on the server and the user won't need to submit them
@InputType()
export class CreateSessionInput {
  @Field()
  date_and_time: Date

  @Field()
  duration_in_hours: number

  @Field()
  session_name: string

  @Field()
  zoom_link: string
}

@InputType()
export class EditSessionInput extends CreateSessionInput {
  @Field(() => SESSION_STATUS)
  session_status: SESSION_STATUS
}