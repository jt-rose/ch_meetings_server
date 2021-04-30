import { Entity, Column, BaseEntity, PrimaryColumn, OneToMany } from 'typeorm'
import { Field, InputType, ObjectType } from 'type-graphql'
import { Workshop } from './WORKSHOP'

@ObjectType()
@Entity()
export class Client extends BaseEntity {
  @Field()
  @PrimaryColumn()
  client!: string

  @Field(() => [String])
  @Column()
  business_units!: string[]

  @Field(() => [Workshop])
  @OneToMany(() => Workshop, (workshop) => workshop.client)
  workshops: Workshop[]
}

// include client/ BU contacts?
@InputType()
export class ClientInput {
  @Field()
  client!: string

  @Field()
  business_units!: string[]

  // workshops will be scheduled separately
}
