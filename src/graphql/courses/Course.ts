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

  @Field(() => Int)
  created_by: number

  @Field(() => Date)
  created_at: Date

  @Field()
  updated_at: Date

  // workshops field resolver
  // coursework field resolver
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
