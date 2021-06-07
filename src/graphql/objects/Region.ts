import { Advisor } from './Advisor'
import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
export class AdvisorRegion {
  @Field(() => Int)
  region_id: number

  @Field(() => Int)
  advisor_id: number

  @Field()
  advisor_region: string

  @Field(() => Advisor)
  advisor: Advisor
}
