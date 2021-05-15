import { ObjectType, Field, InputType } from 'type-graphql'

@ObjectType()
export class Course {
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
