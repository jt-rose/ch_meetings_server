import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
export class WorkshopSession {
  @Field(() => Int)
  workshop_session_id: number

  @Field()
  workshop_id: number

  @Field()
  session_name: string

  @Field(() => Date)
  start_time: Date

  @Field(() => Date)
  end_time: Date

  @Field({ nullable: true })
  meeting_link: string

  @Field(() => Int)
  created_by: number

  @Field(() => Date)
  created_at: Date
}
