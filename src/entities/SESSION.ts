import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'
import { Field, Float, Int, ObjectType } from 'type-graphql'

// date
// time
// duration
// advisor fk
// business fk
// course type
// record attendance
// participants?
// notes
// opid
// language
// timezone
// managers users-fk
// zoom link

// separate sessions from session requests? or perhaps status?
// have single workshops table that links to individual sessions
// autogenerate comms template
// store config summaries in workshop table
// advisor/ user profile pic
// change log

@ObjectType()
@Entity()
export class Session extends BaseEntity {
  @Field(() => Date)
  @Column()
  date!: Date

  @Field(() => Date)
  @Column()
  start_time!: Date

  @Field(() => Date)
  @Column()
  end_time!: Date

  @Field()
  @Column()
  status!: string

  @Field()
  @Column()
  duration!: number

  @Field()
  @Column()
  timezone!: string // use Date?

  @Field()
  @Column()
  advisor!: string

  @Field()
  @Column()
  client!: string

  @Field()
  @Column()
  business_unit!: string

  @Field()
  @Column()
  open_air_id!: string

  @Field(() => Int)
  @Column({ unique: true })
  workshop_id!: number

  @Field()
  @Column()
  workshop_type!: string // enum later

  @Field()
  @Column()
  language!: string

  @Field()
  @Column()
  record_attendance!: boolean

  @Field(() => [String])
  @Column()
  participants!: string[]

  @Field()
  @Column()
  notes: string // text column

  @Field(() => [String])
  @Column()
  client_success_team!: string[]

  @Field(() => [String])
  @Column()
  sales_team!: string[]

  @Field()
  @Column()
  zoom_link!: string

  @Field(() => [String])
  @Column()
  change_log!: string[]

  @Field(() => String) // change to doc later
  @Column()
  config_summary!: string
}

/*
resolver functionality

request session - add to separate entity and link?
add session C
view session R
edit session U
delete session D
validate session
generate comms template
generate meetings planner
*/
