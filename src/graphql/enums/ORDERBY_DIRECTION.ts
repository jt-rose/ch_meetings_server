import { registerEnumType } from 'type-graphql'

export enum ORDERBY_DIRECTION {
  ASC = 'asc',
  DESC = 'desc',
}

registerEnumType(ORDERBY_DIRECTION, {
  name: 'ORDERBY_DIRECTION',
  description: 'sort data by ascending or descending order',
})
