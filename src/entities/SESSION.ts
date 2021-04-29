import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'
import { Field, Int, ObjectType } from 'type-graphql'

// separate sessions from session requests? or perhaps status?
// have single workshops table that links to individual sessions
// autogenerate comms template
// store config summaries in workshop table
// advisor/ user profile pic
// change log

@ObjectType()
@Entity()
export class Session extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  session_id!: number

  @Field(() => Int)
  @Column()
  workshop_id!: number // FK

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
  duration_in_hours!: number

  @Field()
  @Column()
  notes: string // text column

  @Field()
  @Column()
  zoom_link!: string

  @Field(() => [String])
  @Column()
  change_log!: string[]
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
