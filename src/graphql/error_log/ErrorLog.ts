import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
export class ErrorLog {
  @Field(() => Int)
  error_id: number

  @Field()
  error_response: string

  @Field(() => Date)
  error_time: Date

  @Field(() => Int, { nullable: true })
  manager_id?: number
}
