import { registerEnumType } from 'type-graphql'

export enum USER_TYPE {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

registerEnumType(USER_TYPE, {
  name: 'USER_TYPE',
  description: 'distinguish between ordinary users and those with admin access',
})
