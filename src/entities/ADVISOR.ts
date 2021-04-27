import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'
import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
@Entity()
export class Advisor extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => String)
  @Column()
  first_name!: string

  @Field(() => String)
  @Column()
  last_name!: string

  @Field(() => String)
  @Column({ unique: true })
  email!: string

  @Field(() => [Int])
  @Column()
  phone_numbers!: number[]

  @Field(() => [String])
  @Column()
  languages!: string[]

  @Field(() => [String])
  @Column()
  regions!: string[]

  @Field(() => [String])
  @Column()
  notes: string[]

  @Field(() => [Date])
  @Column()
  days_unavailable!: Date[]

  // one to many for sessions
}
