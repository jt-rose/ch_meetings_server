/*
CREATE TABLE client_notes (
    note_id SERIAL PRIMARY KEY,
    client_id INT REFERENCES clients(client_id) NOT NULL,
    note TEXT NOT NULL,
    date_of_note TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
*/
import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
export class ClientNote {
  @Field(() => Int)
  note_id: number

  @Field(() => Int)
  client_id: number

  @Field()
  note: string

  @Field(() => Date)
  date_of_note: Date
}
