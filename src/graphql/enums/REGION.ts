import { registerEnumType } from 'type-graphql'

export enum REGION {
  NAM = 'NAM',
  LATAM = 'LATAM',
  EMEA = 'EMEA',
  APAC = 'APAC',
  ANZ = 'ANZ',
}

registerEnumType(REGION, {
  name: 'REGION',
  description: 'international business regions',
})
