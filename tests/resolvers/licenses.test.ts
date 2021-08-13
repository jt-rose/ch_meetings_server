import { describe } from 'mocha'
import { createMockApolloUser, MockApolloTestRunners } from '../mockApollo'
//import { prisma } from '../../src/prisma'

/* -------------------- test adjusting client licenses -------------------- */

describe('License Resolvers', function () {
  /* ------------------- declare mockUser and initialize it ------------------- */
  let mockUser: MockApolloTestRunners

  before(async function () {
    mockUser = await createMockApolloUser()
  })

  /* -------------------------------- run tests ------------------------------- */

  it('add licenses to client', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
      mutation {
        addLicenses(licenseInput: { client_id: 1, course_id: 2, remaining_amount: 999}) {
          license_id
          client_id
          course_id
          remaining_amount
          license_changes {
            updated_amount
            amount_change
            change_note
          }
        }
      }
    `,
      expectedResult: {
        addLicenses: {
          license_id: 11,
          client_id: 1,
          course_id: 2,
          remaining_amount: 999,
          license_changes: [
            {
              updated_amount: 999,
              amount_change: 999,
              change_note: '999 licenses for course #2 added for client id 1',
            },
          ],
        },
      },
    })
  })

  it('update licenses for client', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
      mutation {
        editAvailableLicenses(licenseInput: { license_id: 1, remaining_amount: 300, change_note: "increase licenses"}) {
        license_id
          course_id
          client_id
          remaining_amount
          license_changes {
            license_change_id
            updated_amount
            amount_change
            change_note
          }
        }
      }
    `,
      expectedResult: {
        editAvailableLicenses: {
          license_id: 1,
          course_id: 1,
          client_id: 1,
          remaining_amount: 300,
          license_changes: [
            {
              license_change_id: 1,
              updated_amount: 220,
              amount_change: 220,
              change_note: 'added to program',
            },
            {
              license_change_id: 2,
              updated_amount: 193,
              amount_change: -23,
              change_note: 'Reserved 23 licenses for workshop ID: 1',
            },
            {
              license_change_id: 3,
              updated_amount: 193,
              amount_change: 0,
              change_note:
                'Completed workshop: Workshop-ID 1, finalized use of 23 licenses',
            },
            {
              license_change_id: 14,
              updated_amount: 300,
              amount_change: 107,
              change_note: 'increase licenses',
            },
          ],
        },
      },
    })
  })

  it('reject editing license when license not found', async function () {
    await mockUser.confirmError({
      gqlScript: `
      mutation {
        editAvailableLicenses(licenseInput: {license_id: 100, remaining_amount: 200, change_note: "test adding new license"}) {
          license_id
          client_id
          remaining_amount
          license_changes {
            change_note
          }
        }
      }
    `,
      expectedErrorMessage: 'no such license found!',
    })
  })

  it('retrieve client license information', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
    query {
  getClient( client_id: 1) {
    client_id
    licenses {
      license_id
      client_id
      course_id
      remaining_amount
    }
  }
}
    `,
      expectedResult: {
        getClient: {
          client_id: 1,
          licenses: [
            {
              license_id: 1,
              client_id: 1,
              course_id: 1,
              remaining_amount: 193,
            },
            {
              license_id: 2,
              client_id: 1,
              course_id: 3,
              remaining_amount: 35,
            },
          ],
        },
      },
    })
  })
  it('convert licenses from one course to another')
  /* ---------------------- test license field resolvers ---------------------- */
  it('retreive reserved licenses')
  it('retreive field resolvers on license object', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
    query {
  getClient( client_id: 1) {
    client_id
    licenses {
      license_id
      license_changes {
        amount_change
        updated_amount
        change_note
      }
      client_id
      client {
        client_name
      }
    }
  }
}
    `,
      expectedResult: {
        getClient: {
          client_id: 1,
          licenses: [
            {
              license_id: 1,
              license_changes: [
                {
                  amount_change: 220,
                  updated_amount: 220,
                  change_note: 'added to program',
                },
                {
                  amount_change: -23,
                  updated_amount: 193,
                  change_note: 'Reserved 23 licenses for workshop ID: 1',
                },
                {
                  amount_change: 0,
                  change_note:
                    'Completed workshop: Workshop-ID 1, finalized use of 23 licenses',
                  updated_amount: 193,
                },
              ],
              client_id: 1,
              client: {
                client_name: 'Acme Corp',
              },
            },
            {
              license_id: 2,
              license_changes: [
                {
                  amount_change: 35,
                  updated_amount: 35,
                  change_note: 'added to program',
                },
              ],
              client_id: 1,
              client: {
                client_name: 'Acme Corp',
              },
            },
          ],
        },
      },
    })
  })
  it('create reserved license amount and update available licenses')
  it('reject reserving licenses when no current licenses found')
  it(
    'reject reserving licenses when reserved amount is higher than available license amount'
  )
})
