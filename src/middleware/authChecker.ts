import { AuthChecker, Authorized } from 'type-graphql'
import { Context } from '../utils/context'

// define types of roles
type Roles = 'ADMIN' // | 'SUPER'

// export descriptive authentication wrappers
export const Authenticated = () => Authorized()
export const AdminOnly = () => Authorized('ADMIN')

// authentication / user role logic - for production
export const authChecker: AuthChecker<Context, Roles> = (
  { context: { session } },
  roles
) => {
  const { manager_id, admin } = session

  // for basic access (no roles specified - @Authorized()),
  // check that a manager_id has been stored
  if (roles.length === 0) return !!manager_id

  // for admin access, check that an admin property
  // has been stored in req
  if (roles.includes('ADMIN') && admin) return true

  // no roles matched, restrict access
  return false
}

// NOTE: mock authChecker functions were built to unit test
// authenticated routes on the server
// however, as the req/ res objects were supplied by apollo
// this threw an error, and context had to be directly mocked
// by using DI when initializing apollo

// I am leaving these here, commented out, for now
// but will remove later once apollo mocking is complete

// authChecker using mock signed-in user - for testing
/*export const MockUserAuthChecker: AuthChecker<Context, Roles> = (
  { context: { session } },
  roles
) => {
  // ignore req contents and manually assign parameters
  // ONLY FOR TESTING!
  const manager_id = session.manager_id || 2
  const admin = session.admin || undefined

  // for basic access (no roles specified - @Authorized()),
  // check that a manager_id has been stored
  if (roles.length === 0) return !!manager_id

  // for admin access, check that an admin property
  // has been stored in req
  if (roles.includes('ADMIN') && admin) return true

  // no roles matched, restrict access
  return false
}

// authChecker using mock signedin admin - for testing
export const MockAdminAuthChecker: AuthChecker<Context, Roles> = (
  { context: { session } },
  roles
) => {
  // ignore req contents and manually assign parameters
  // ONLY FOR TESTING!
  const manager_id = session.manager_id || 1
  const admin = session.admin || 'ADMIN'

  // for basic access (no roles specified - @Authorized()),
  // check that a manager_id has been stored
  if (roles.length === 0) return !!manager_id

  // for admin access, check that an admin property
  // has been stored in req
  if (roles.includes('ADMIN') && admin) return true

  // no roles matched, restrict access
  return false
}
*/
