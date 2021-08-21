import { Context } from '../utils/context'
import { MiddlewareFn } from 'type-graphql'

// normal errors will have the error message hidden
// and be logged in the error_log table
// with an error_id shared so the user can reach oout to IT if needed

// CustomError will be used for user-created issues
// where a unique, user-freindly error message
// will be shared directly with the user

// for example, incorrect business logic would be hidden
// but a user attempting to use a duplicate name for a workshop
// would be shared so they could correct the issue on their own
export class CustomError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CustomError'
  }
}

// intercept errors, log normal errors,
// and format the error message as appropriate
export const ErrorInterceptor: MiddlewareFn<Context> = async (
  { context },
  next
) => {
  try {
    return await next()
  } catch (err) {
    // allow custom errors to pass directly to the front end
    if (err instanceof CustomError) {
      throw err
    }

    // log the error
    console.log(err)

    // store error log in database
    const errorLog = await context.prisma.error_log.create({
      data: {
        error_response: JSON.stringify(err),
        error_time: new Date(),
        manager_id: context.req.session.manager_id,
      },
    })

    // return a generic error message with error id for any other errors
    throw Error(
      `Uh oh! Looks like something went wrong! Please try again or ask the IT support team to investigate ERROR_ID: ${errorLog.error_id}`
    )
  }
}
