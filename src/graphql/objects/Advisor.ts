import { ObjectType, Field, Int } from 'type-graphql'
import { AdvisorLanguage } from './AdvisorLanguage'
import { AdvisorRegion } from './AdvisorRegion'
import { AdvisorUnavailableDays } from './AdvisorUnavailableDays'
import { AdvisorNote } from './AdvisorNote'

@ObjectType()
export class Advisor {
  @Field(() => Int)
  advisor_id: number

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

  @Field(() => [AdvisorNote])
  advisor_notes: AdvisorNote[]

  // assigned_workshops field resolver
  // requested_for_pending_workshops field resolver
}
