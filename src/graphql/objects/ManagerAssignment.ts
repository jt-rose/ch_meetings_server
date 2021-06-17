import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
export class ManagerAssignment {
  @Field(() => Int)
  assignment_id: number

  @Field(() => Int)
  manager_id: number

  @Field(() => Int)
  workshop_id: number
}
