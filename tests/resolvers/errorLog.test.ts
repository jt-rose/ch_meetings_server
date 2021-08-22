import { describe } from 'mocha'
import { prisma } from '../../src/prisma'
import {
  createMockApolloAdmin,
  createMockApolloUser,
  MockApolloTestRunners,
} from '../mockApollo'

describe('Error Log Resolvers', function () {
  /* ------------------- declare mockUser and initialize it ------------------- */

  let mockUser: MockApolloTestRunners
  let mockAdmin: MockApolloTestRunners

  before(async function () {
    mockUser = await createMockApolloUser()
    mockAdmin = await createMockApolloAdmin()
  })

  /* -------------------------------- run tests ------------------------------- */
  it('get error logs', async function () {
    await mockAdmin.confirmResponse({
      gqlScript: `{
        getAllErrorLogs(take: 3, skip: 1, orderBy: ASC) {
          error_time
          error_response
          manager_id
        }
      }
        `,
      expectedResult: {
        getAllErrorLogs: [
          {
            error_time: '2016-08-31T04:00:00.000Z',
            error_response: 'Sample error log 2',
            manager_id: 1,
          },
          {
            error_time: '2017-09-14T04:00:00.000Z',
            error_response: 'Sample error log 3',
            manager_id: 1,
          },
          {
            error_time: '2020-10-03T04:00:00.000Z',
            error_response: 'Sample error log 4',
            manager_id: 2,
          },
        ],
      },
    })
  })
  it('reject getting error logs when not admin', async function () {
    await mockUser.confirmError({
      gqlScript: `
      {
        getAllErrorLogs(take: 3, skip: 1, orderBy: ASC) {
          error_time
          error_response
          manager_id
        }
      }
        `,
      expectedErrorMessage:
        "Access denied! You don't have permission for this action!",
    })
  })
  it('remove error log', async function () {
    await mockAdmin.confirmResponse({
      gqlScript: `
      mutation {
        removeErrorLog(error_id: 3) {
          error_id
          error_response
        }
      }
      `,
      expectedResult: {
        removeErrorLog: {
          error_id: 3,
          error_response: 'Sample error log 3',
        },
      },
    })

    await mockAdmin.confirmDBRemoval({
      databaseQuery: prisma.error_log.count({ where: { error_id: 3 } }),
    })
  })
  it('reject removing error log when not admin', async function () {
    await mockUser.confirmError({
      gqlScript: `
    mutation {
      removeErrorLog(error_id: 3) {
        error_id
        error_response
      }
    }
    `,
      expectedErrorMessage:
        "Access denied! You don't have permission for this action!",
    })
  })
})
