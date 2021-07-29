import { ObjectType, Field, Int } from 'type-graphql'
import { Workshop } from './Workshop'
import { AvailableLicense } from './AvailableLicense'
import { LicenseChange } from './LicenseChange'

@ObjectType()
export class ReservedLicense {
  @Field(() => Int)
  reserved_license_id: number

  @Field(() => Int)
  license_id: number

  @Field(() => Int)
  reserved_amount: number

  reserved_status: string

  workshop_id: number

  @Field(() => Int)
  created_by: number

  @Field(() => Date)
  created_at: Date

  @Field(() => Date)
  last_updated: Date

  /* ----------------------------- field resolvers ---------------------------- */
  @Field(() => [AvailableLicense])
  available_licenses: AvailableLicense[]

  @Field(() => [LicenseChange])
  license_changes: LicenseChange[]

  @Field(() => Workshop)
  workshop: Workshop
}
