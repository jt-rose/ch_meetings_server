import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'
import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
@Entity()
export class Workshop extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  workshop_id!: number

  @Field()
  @Column()
  course_type!: string // enum later

  @Field()
  @Column()
  conference_type!: string // change to enum later, ex: in_person, zoom, teams, etc.

  @Field(() => [Int])
  @Column()
  sessions!: number[] // sessions ID[]
  // breakout to sess1, sess2

  @Field()
  @Column()
  client!: string // change to FK later

  @Field()
  @Column()
  business_unit: string

  @Field()
  @Column()
  open_air_id!: string

  @Field()
  @Column()
  status!: string // change to enum later

  @Field()
  @Column()
  time_zone!: string

  @Field()
  @Column()
  language!: string

  @Field()
  @Column()
  record_attendance!: boolean

  @Field(() => [String])
  @Column()
  client_success_team!: string[] // change to user FK?

  @Field(() => [String])
  @Column()
  sales_team!: string[]

  @Field(() => [String])
  @Column()
  change_log: string[] // may change to jsonb later

  @Field()
  @Column()
  config_summary: string // change to doc type later

  @Field(() => [String])
  @Column()
  notes: string[]
}

// * Notes: May break out sessions and possibly include participant list
// sess1, sess2...
// participants
