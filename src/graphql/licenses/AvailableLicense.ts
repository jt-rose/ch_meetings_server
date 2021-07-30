import { ObjectType, Field, Int } from 'type-graphql'
import { Course } from '../courses/Course'
import { Client } from '../clients/Client'
import { LicenseChange } from './LicenseChange'
import { ReservedLicense } from './ReservedLicenses'

@ObjectType()
export class AvailableLicense {
  @Field(() => Int)
  license_id: number

  @Field(() => Int)
  course_id: number

  @Field(() => Int)
  client_id: number

  @Field(() => Int)
  remaining_amount: number

  @Field(() => Int)
  created_by: number

  @Field(() => Date)
  created_at: Date

  @Field(() => Date)
  last_updated: Date

  /* ----------------------------- field resolvers ---------------------------- */
  @Field(() => Course)
  course: Course

  @Field(() => Client)
  client: Client

  @Field(() => [ReservedLicense])
  reserved_licenses: ReservedLicense[]

  @Field(() => [LicenseChange])
  license_changes: LicenseChange[]
}
