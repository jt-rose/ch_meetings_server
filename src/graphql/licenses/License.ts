import { ObjectType, Field, Int } from 'type-graphql'
import { Course } from '../courses/Course'
import { Client } from '../clients/Client'
import { LicenseChange } from './LicenseChange'
import { LICENSE_TYPE } from '../enums/LICENSE_TYPE'

@ObjectType()
export class License {
  @Field(() => Int)
  license_id: number

  @Field(() => Int)
  course_id: number

  @Field(() => Int)
  client_id: number

  @Field(() => Int)
  license_amount: number

  @Field(() => Int)
  created_by: number

  @Field(() => Date)
  created_at: Date

  @Field(() => Date)
  last_updated: Date

  @Field(() => LICENSE_TYPE)
  license_type: LICENSE_TYPE

  /* ----------------------------- field resolvers ---------------------------- */
  @Field(() => Course)
  course: Course

  @Field(() => Client)
  client: Client

  @Field(() => [LicenseChange])
  license_changes: LicenseChange[]
}
