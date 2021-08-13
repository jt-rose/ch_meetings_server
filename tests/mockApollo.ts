import { ApolloServer } from 'apollo-server-express'
import { PrismaPromise } from '@prisma/client'
import { createSchema } from '../src/createSchema'
import { createServer } from '../src/apollo'
import {
  createMockUserContext,
  createMockAdminContext,
  CreateContext,
  createMockCoordinatorContext,
  createMockSuperAdminContext,
} from '../src/utils/context'
import {
  confirmResponse,
  confirmError,
  confirmDBUpdate,
  confirmDBRemoval,
  confirmTimeConflictError,
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
    confirmTimeConflictError: confirmTimeConflictError(apollo),
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

  confirmTimeConflictError: (config: {
    gqlScript: string
    timeConflictError: any
  }) => Promise<void>
}

export const createMockApolloUser = createMockApollo(createMockUserContext)
export const createMockApolloAdmin = createMockApollo(createMockAdminContext)
export const createMockApolloCoordinator = createMockApollo(
  createMockCoordinatorContext
)
export const createMockApolloSuperAdmin = createMockApollo(
  createMockSuperAdminContext
)
