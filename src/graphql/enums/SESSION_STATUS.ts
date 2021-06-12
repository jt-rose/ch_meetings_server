import { registerEnumType } from 'type-graphql'

export enum SESSION_STATUS {
  REQUESTED = 'REQUESTED',
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  HOLD_A = 'HOLD A',
  HOLD_B = 'HOLD B',
}

registerEnumType(SESSION_STATUS, {
  name: 'SESSION_STATUS',
  description: 'status of workshops and individual session requests',
})
