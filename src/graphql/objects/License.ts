import { ObjectType, Field, Int } from 'type-graphql'
import { Course } from './Course'
import { Client } from './Client'
import { LicenseChange } from './LicenseChange'

@ObjectType()
export class License {
  @Field(() => Int)
  license_id: number

  @Field(() => Int)
  course_id: number

  @Field(() => Int)
  client_id: number

  @Field(() => Int)
  remaining_amount: number

  /* ----------------------------- field resolvers ---------------------------- */
  @Field(() => Course)
  course: Course

  @Field(() => Client)
  client: Client

  @Field(() => [LicenseChange])
  license_changes: LicenseChange[]
}
