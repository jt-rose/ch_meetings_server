import { ObjectType, Field, Int } from 'type-graphql'
import { AdvisorLanguage } from './AdvisorLanguage'
import { AdvisorRegion } from './AdvisorRegion'
import { AdvisorUnavailableTime } from './AdvisorUnavailableTime'
import { AdvisorNote } from './AdvisorNote'
import { Workshop } from '../workshops/Workshop'

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

  @Field()
  active: boolean

  /* ----------------------------- field resolvers ---------------------------- */

  @Field(() => [AdvisorRegion])
  regions: AdvisorRegion[]

  @Field(() => [AdvisorLanguage])
  languages: AdvisorLanguage[]

  @Field(() => [AdvisorUnavailableTime])
  unavailable_days: AdvisorUnavailableTime[]

  @Field(() => [AdvisorNote])
  advisor_notes: AdvisorNote[]

  @Field(() => [Workshop])
  assigned_workshops: Workshop[]

  @Field(() => [Workshop])
  requested_workshops: Workshop[]
}
