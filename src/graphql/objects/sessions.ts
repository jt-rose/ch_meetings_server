/*
CREATE TABLE workshop_sessions (
    workshop_session_id BIGSERIAL PRIMARY KEY,
    workshop_id BIGINT REFERENCES workshops (workshop_id) NOT NULL,
    session_date DATE NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    session_status VARCHAR(255) NOT NULL,
    -- switch to enums
    duration_in_hours DECIMAL(1, 1) NOT NULL,
    zoom_link VARCHAR(255)
);
*/
import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
export class WorkshopSession {
  @Field(() => Int)
  workshop_session_id: number

  @Field()
  workshop_id: number // Workshop[]

  @Field()
  session_date: string // Date? or Scalar?

  @Field()
  start_time: string // scalar?

  @Field()
  session_status: string // enum

  @Field()
  duration_in_hours: number // float

  @Field()
  zoom_link: string
}
