import { registerEnumType } from 'type-graphql'

export enum USER_TYPE {
  USER = 'USER',
  COORDINATOR = 'COORDINATOR',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

registerEnumType(USER_TYPE, {
  name: 'USER_TYPE',
  description:
    'distinguish different types of users with different permissions',
})
