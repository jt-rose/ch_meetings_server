import { ApolloServer } from 'apollo-server-express'
import { PrismaPromise } from '@prisma/client'
import { createSchema } from '../src/createSchema'
import { createServer } from '../src/apollo'
import {
  createMockUserContext,
  createMockAdminContext,
  CreateContext,
} from '../src/utils/context'
import {
  confirmResponse,
  confirmError,
  confirmDBUpdate,
  confirmDBRemoval,
} from './queryTester'

// reduce some boilerplate when generating mock versions of apollo
const createMockApollo = (createContext: CreateContext) => async () => {
  const schema = await createSchema()
  const apolloMockUser = await createServer(schema, createContext)
  const apollo = apolloMockUser.apolloServer
  return {
    apollo,
    confirmResponse: confirmResponse(apollo),
    confirmError: confirmError(apollo),
    confirmDBUpdate,
    confirmDBRemoval,
  }
}

export interface MockApolloTestRunners {
  apollo: ApolloServer

  confirmResponse: (config: {
    gqlScript: string
    expectedResult: any
  }) => Promise<void>

  confirmError: (config: {
    gqlScript: string
    expectedErrorMessage: string
  }) => Promise<void>

  confirmDBUpdate: (config: {
    databaseQuery: PrismaPromise<number>
  }) => Promise<void>

  confirmDBRemoval: (config: {
    databaseQuery: PrismaPromise<number>
  }) => Promise<void>
}

export const createMockApolloUser = createMockApollo(createMockUserContext)
export const createMockApolloAdmin = createMockApollo(createMockAdminContext)
