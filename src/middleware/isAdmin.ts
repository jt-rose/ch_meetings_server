import { Context } from '../utils/context'
import { MiddlewareFn } from 'type-graphql'

export const isAdmin: MiddlewareFn<Context> = async ({ context }, next) => {
  if (!context.req.session.admin) {
    throw Error('admin access required')
  }
  return next()
}
