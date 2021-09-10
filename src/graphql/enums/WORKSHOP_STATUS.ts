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

// Coordinators may update the workshop status to VETTING or HOLDING
// without having to push through a change request
// this enum is to isolate those two for use in the workshop resolver's
// "update Scheduing Status" method
export enum SCHEDULING_PROCESS {
  VETTING = 'VETTING',
  HOLDING = 'HOLDING',
}

registerEnumType(SCHEDULING_PROCESS, {
  name: 'SCHEDULING_PROCESS',
})
