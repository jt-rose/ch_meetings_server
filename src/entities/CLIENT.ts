import { Entity, Column, BaseEntity, PrimaryColumn } from 'typeorm'
import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
@Entity()
export class Client extends BaseEntity {
  @Field()
  @PrimaryColumn()
  client!: string

  @Field(() => [String])
  @Column()
  business_units!: string[]

  @Field(() => [Int])
  @Column()
  workshops: number[] // FK[]
}

// include client/ BU contacts?
