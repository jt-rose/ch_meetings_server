import { Advisor } from './Advisor'
import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
export class AdvisorLanguage {
  @Field(() => Int)
  language_id: number

  @Field(() => Int)
  advisor_id: number

  @Field()
  advisor_language: string

  @Field(() => Advisor)
  advisor: Advisor
}
