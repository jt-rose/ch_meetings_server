import { registerEnumType } from 'type-graphql'

export enum SESSION_STATUS {
  REQUESTED = 'REQUESTED',
  SCHEDULED = 'SCHEDULED',
  VETTING = 'VETTING',
  HOLDING = 'HOLDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

registerEnumType(SESSION_STATUS, {
  name: 'SESSION_STATUS',
  description: 'status of workshops and individual session requests',
})
