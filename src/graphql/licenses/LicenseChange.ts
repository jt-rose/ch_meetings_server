import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
export class LicenseChange {
  @Field(() => Int)
  license_change_id: number

  @Field(() => Int)
  license_id: number

  @Field(() => Int)
  available_amount_change: number

  @Field(() => Int)
  used_amount_change: number

  @Field(() => Int)
  reserved_amount_change: number

  @Field(() => Int, { nullable: true })
  workshop_id?: number

  @Field(() => Int)
  manager_id: number

  @Field(() => Int)
  created_by: number

  @Field(() => Date)
  created_at: Date

  @Field()
  change_note: string
}
