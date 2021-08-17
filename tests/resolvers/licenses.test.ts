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
  it('convert licenses from one course to another, creating new license', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
      mutation {
        convertAvailableLicenses(license_id: 1, targetCourse: 4, conversionAmount: 10) {
          remaining_amount
          course_id
  client_id
  license_changes {
    amount_change
    updated_amount
    change_note
  }
        }
      }
      `,
      expectedResult: {
        convertAvailableLicenses: [
          {
            remaining_amount: 183,
            course_id: 1,
            client_id: 1,
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
                updated_amount: 193,
                change_note:
                  'Completed workshop: Workshop-ID 1, finalized use of 23 licenses',
              },
              {
                amount_change: -10,
                updated_amount: 183,
                change_note: '10 licenses converted to course #4',
              },
            ],
          },
          {
            remaining_amount: 10,
            course_id: 4,
            client_id: 1,
            license_changes: [
              {
                amount_change: 10,
                updated_amount: 10,
                change_note:
                  '10 licenses converted from license #1 to new licenses for course #4',
              },
            ],
          },
        ],
      },
    })
  })
  it('convert licenses from one course to another, adding to existing license', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
      mutation {
        convertAvailableLicenses(license_id: 5, targetCourse: 3, conversionAmount: 10) {
          remaining_amount
          course_id
  client_id
  license_changes {
    amount_change
    updated_amount
    change_note
  }
        }
      }
      `,
      expectedResult: {
        convertAvailableLicenses: [
          {
            remaining_amount: 53,
            course_id: 1,
            client_id: 4,
            license_changes: [
              {
                amount_change: 63,
                updated_amount: 63,
                change_note: 'added to program',
              },
              {
                amount_change: -10,
                updated_amount: 53,
                change_note: '10 licenses converted to course #3',
              },
            ],
          },
          {
            remaining_amount: 30,
            course_id: 3,
            client_id: 4,
            license_changes: [
              {
                amount_change: 20,
                updated_amount: 20,
                change_note: 'added to program',
              },
              {
                amount_change: 10,
                updated_amount: 10,
                change_note:
                  '10 licenses converted from license #5 to new licenses for course #3',
              },
            ],
          },
        ],
      },
    })
  })
  it('reject converting licenses when current license not found', async function () {
    await mockUser.confirmError({
      gqlScript: `
      mutation {
        convertAvailableLicenses(license_id: 999, targetCourse: 3, conversionAmount: 100) {
          remaining_amount
          course_id
        }
      }
      `,
      expectedErrorMessage: 'No such license exists!',
    })
  })
  it('reject converting licenses when target course not found', async function () {
    await mockUser.confirmError({
      gqlScript: `
      mutation {
        convertAvailableLicenses(license_id: 1, targetCourse: 999, conversionAmount: 10) {
          remaining_amount
          course_id
        }
      }
      `,
      expectedErrorMessage: 'No such course exists to move licenses into!',
    })
  })
  it('reject converting licenses when conversion amount exceeds current license total', async function () {
    await mockUser.confirmError({
      gqlScript: `
        mutation {
          convertAvailableLicenses(license_id: 1, targetCourse: 3, conversionAmount: 99999) {
            remaining_amount
            course_id
          }
        }
        `,
      expectedErrorMessage: 'Not enough licenses to convert this amount!',
    })
  })
  it('reject converting licenses when target course is same as current license course', async function () {
    await mockUser.confirmError({
      gqlScript: `
        mutation {
          convertAvailableLicenses(license_id: 1, targetCourse: 1, conversionAmount: 10) {
            remaining_amount
            course_id
          }
        }
        `,
      expectedErrorMessage:
        'Cannot convert licenses from and to the same course!',
    })
  })
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
