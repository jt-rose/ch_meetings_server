import { InputType, Field } from 'type-graphql'

// user input for creating a session
// the workshop_id, session status,, and created_at/ created_by info
// will be generated on the server and the user won't need to submit them
@InputType()
export class CreateSessionInput {
  @Field()
  start_time: Date

  @Field()
  end_time: Date

  @Field()
  session_name: string

  @Field({ nullable: true })
  meeting_link?: string
}
