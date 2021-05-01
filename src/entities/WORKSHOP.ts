import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import { Field, Int, ObjectType } from 'type-graphql'
import { Advisor } from './ADVISOR'
import { Client } from './CLIENT'
import { Session } from './SESSION'

@ObjectType()
@Entity()
export class Workshop extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  workshop_id!: number

  @Field()
  @Column()
  course_type!: string // enum later

  @ManyToOne(() => Advisor, (advisor) => advisor.email)
  advisor!: Advisor

  @Field()
  @Column()
  conference_type!: string // change to enum later, ex: in_person, zoom, teams, etc.

  @Field(() => [Session])
  @OneToMany(() => Session, (session) => session.session_id)
  sessions!: Session[]
  // breakout to sess1, sess2

  @ManyToOne(() => Client, (client) => client.client)
  client!: Client

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
  @Column('text', { array: true })
  client_success_team!: string[] // change to user FK?

  @Field(() => [String])
  @Column('text', { array: true })
  sales_team!: string[]

  @Field(() => [String])
  @Column('text', { array: true })
  change_log: string[] // may change to jsonb later

  @Field()
  @Column()
  config_summary: string // change to doc type later

  @Field(() => [String])
  @Column('text', { array: true })
  notes: string[]
}

// * Notes: May break out sessions and possibly include participant list
// sess1, sess2...
// participants
