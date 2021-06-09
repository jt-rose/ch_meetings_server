import { registerEnumType } from 'type-graphql'

export enum REGION {
  NAM = 'NAM',
  LATAM = 'LATAM',
  EMEA = 'EMEA',
  APAC = 'APAC',
  ANZ = 'ANZ',
}

registerEnumType(REGION, {
  name: 'REGION', // this one is mandatory
  description: 'international business regions', // this one is optional
})
