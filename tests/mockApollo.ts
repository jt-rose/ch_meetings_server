import { createSchema } from '../src/createSchema'
import { createServer } from '../src/apollo'
import {
  createMockUserContext,
  createMockAdminContext,
  CreateContext,
} from '../src/utils/context'

// reduce some boilerplate when generating mock versions of apollo
const createMockApollo = (createContext: CreateContext) => async () => {
  const schema = await createSchema()
  const apolloMockUser = await createServer(schema, createContext)
  return apolloMockUser.apolloServer
}

export const createMockApolloUser = createMockApollo(createMockUserContext)
export const createMockApolloAdmin = createMockApollo(createMockAdminContext)
