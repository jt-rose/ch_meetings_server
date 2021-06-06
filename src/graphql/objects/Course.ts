import { ObjectType, Field, Int, InputType } from 'type-graphql'

@ObjectType()
export class Course {
  @Field(() => Int)
  course_id: number

  @Field()
  course_name: string

  @Field()
  course_description: string

  @Field()
  active: boolean

  @Field()
  virtual_course: boolean

  @Field()
  created_at: Date

  @Field()
  updated_at: Date
}

@InputType()
export class CourseInput {
  @Field()
  course_name: string

  @Field()
  course_description: string

  @Field()
  active: boolean

  @Field()
  virtual_course: boolean
}
