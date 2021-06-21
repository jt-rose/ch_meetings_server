import { Context } from '../utils/context'
import { MiddlewareFn } from 'type-graphql'

export const isAuth: MiddlewareFn<Context> = ({ context }, next) => {
  if (!context.req.session.manager_id) {
    throw new Error('not authenticated')
  }
  return next()
}
