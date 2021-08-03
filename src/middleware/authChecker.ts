import { AuthChecker, Authorized } from 'type-graphql'
import { Context, UserRole } from '../utils/context'

// export descriptive authentication wrappers
export const Authenticated = () =>
  Authorized(['USER', 'COORDINATOR', 'ADMIN', 'SUPERADMIN'])
export const CoordinatorOrAdminOnly = () =>
  Authorized(['COORDINATOR', 'ADMIN', 'SUPERADMIN'])
export const AdminOnly = () => Authorized(['ADMIN', 'SUPERADMIN'])
export const SuperAdminOnly = () => Authorized(['SUPERADMIN'])

// authentication / user role logic - for production
export const authChecker: AuthChecker<Context, UserRole> = (
  { context: { req } },
  roles
) => {
  const { role } = req.session

  // confirm a role has been set and check if it matches an allowed user role
  if (role && roles.includes(role)) return true

  // no permitted roles matched, restrict access
  return false
}
