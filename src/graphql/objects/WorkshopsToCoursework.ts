import { ObjectType, Field, Int } from 'type-graphql'

// workshops to coursework many to many relationship
@ObjectType()
export class WorkshopsToCoursework {
  @Field(() => Int)
  workshop_coursework_id: number

  @Field(() => Int)
  workshop_id: number

  @Field(() => Int)
  coursework_id: number
}
