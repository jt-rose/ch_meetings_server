import { registerEnumType } from 'type-graphql'

export enum LICENSE_TYPE {
  INDIVIDUAL_PARTICIPANT = 'INDIVIDUAL_PARTICIPANT',
  FULL_WORKSHOP = 'FULL_WORKSHOP',
}

registerEnumType(LICENSE_TYPE, {
  name: 'LICENSE_TYPE',
  description:
    'Distinguish between licenses for individual participants in a workshop or a license covering a single full workshop (all participants included)',
})
