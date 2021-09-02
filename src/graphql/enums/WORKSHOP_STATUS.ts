import { registerEnumType } from 'type-graphql'

export enum WORKSHOP_STATUS {
  REQUESTED = 'REQUESTED',
  SCHEDULED = 'SCHEDULED',
  VETTING = 'VETTING',
  HOLDING = 'HOLDING',
  RESCHEDULING = 'RESCHEDULING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

registerEnumType(WORKSHOP_STATUS, {
  name: 'WORKSHOP_STATUS',
  description: 'status of workshop requests',
})
