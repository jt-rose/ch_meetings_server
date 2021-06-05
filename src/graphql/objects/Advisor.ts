import { ObjectType, Field } from 'type-graphql'
import { AdvisorLanguage } from './Languages'
import { AdvisorRegion } from './Region'
import { AdvisorUnavailableDays } from './UnavailableDays'

@ObjectType()
export class Advisor {
  @Field()
  email: string

  @Field()
  first_name: string

  @Field()
  last_name: string

  @Field(() => [AdvisorRegion])
  regions: AdvisorRegion[]

  @Field(() => [AdvisorLanguage])
  languages: AdvisorLanguage[]

  @Field(() => [AdvisorUnavailableDays])
  unavailable_days: AdvisorUnavailableDays[]
}
