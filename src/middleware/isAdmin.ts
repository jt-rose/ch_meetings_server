import { Context } from '../utils/context'
import { MiddlewareFn } from 'type-graphql'

export const isAdmin: MiddlewareFn<Context> = async ({ context }, next) => {
  const { manager_id } = context.req.session
  if (!manager_id) {
    throw new Error('not authenticated')
  }
  const isAdmin = await context.prisma.managers.findFirst({
    where: { manager_id, user_type: 'ADMIN' },
  })
  if (!isAdmin) {
    throw Error('admin access required')
  }
  return next()
}
