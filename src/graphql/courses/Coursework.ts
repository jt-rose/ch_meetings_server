import { ObjectType, Field, Int } from 'type-graphql'
import { Course } from './Course'

@ObjectType()
export class Coursework {
  @Field(() => Int)
  coursework_id: number

  @Field()
  coursework_name: string

  @Field({ nullable: true })
  coursework_description?: string

  @Field()
  active: boolean

  @Field(() => [Course])
  courses: Course[]

  @Field(() => Int)
  created_by: number

  // workshops field resolver
}
