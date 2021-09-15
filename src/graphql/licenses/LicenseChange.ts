import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
export class LicenseChange {
  @Field(() => Int)
  license_change_id: number

  @Field(() => Int)
  license_id: number

  @Field(() => Int)
  updated_amount: number

  @Field(() => Int)
  amount_change: number

  @Field(() => Int, { nullable: true })
  workshop_id?: number

  @Field(() => Int, { nullable: true })
  reserved_license_id?: number

  @Field(() => Int)
  manager_id: number

  @Field(() => Int)
  created_by: number

  @Field(() => Date)
  created_at: Date

  @Field()
  change_note: string
}
