import { ObjectType, Field, Int } from 'type-graphql'
import { REGION } from '../enums/REGION'

@ObjectType()
export class AdvisorRegion {
  @Field(() => Int)
  region_id: number

  @Field(() => Int)
  advisor_id: number

  @Field(() => REGION)
  advisor_region: REGION
}
