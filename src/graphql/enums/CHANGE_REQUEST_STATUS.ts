import { registerEnumType } from 'type-graphql'

export enum CHANGE_REQUEST_STATUS {
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REJECTED_WITH_DIFFERENT_CHANGES_REQUESTED = 'REJECTED WITH DIFFERENT CHANGES REQUESTED',
}

registerEnumType(CHANGE_REQUEST_STATUS, {
  name: 'CHANGE_REQUEST_STATUS',
  description:
    'Document whether a change request was accepted, rejected, or rejected with a request for different changes',
})
