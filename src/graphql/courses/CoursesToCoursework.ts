import { ObjectType, Field, Int } from 'type-graphql'

// course to coursework many to many relationship
@ObjectType()
export class CoursesToCoursework {
  @Field(() => Int)
  course_and_coursework_id: number

  @Field(() => Int)
  course_id: number

  @Field(() => Int)
  coursework_id: number
}
