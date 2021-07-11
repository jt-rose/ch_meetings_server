import { AuthChecker, Authorized } from 'type-graphql'
import { Context } from '../utils/context'

// define types of roles
type Roles = 'ADMIN' // | 'SUPER'

// export descriptive authentication wrappers
export const Authenticated = () => Authorized()
export const AdminOnly = () => Authorized('ADMIN')

// authentication / user role logic - for production
export const authChecker: AuthChecker<Context, Roles> = (
  { context: { req } },
  roles
) => {
  const { manager_id, admin } = req.session

  // for basic access (no roles specified - @Authorized()),
  // check that a manager_id has been stored
  if (roles.length === 0) return !!manager_id

  // for admin access, check that an admin property
  // has been stored in req
  if (roles.includes('ADMIN') && admin) return true

  // no roles matched, restrict access
  return false
}
