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
  editLicenseAmount(licenseInput: {client_id: 1, course_id: 1, remaining_amount: 200, change_note: "test adding new license", workshop_id: 1}) {
    license_id
    client_id
    remaining_amount
    license_changes {
      change_note
    }
  }
}
    `,
      expectedResult: {
        editLicenseAmount: {
          license_id: 11,
          client_id: 1,
          remaining_amount: 200,
          license_changes: [
            {
              change_note: 'test adding new license',
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
  editLicenseAmount(licenseInput: {license_id: 1, client_id: 1, course_id: 1, remaining_amount: 200, change_note: "test updating license", workshop_id: 1}) {
    license_id
    client_id
    remaining_amount
    license_changes {
      change_note
    }
  }
}
    `,
      expectedResult: {
        editLicenseAmount: {
          license_id: 1,
          client_id: 1,
          remaining_amount: 200,
          license_changes: [
            {
              change_note: 'added to program',
            },
            {
              change_note: 'Completed workshop: Workshop-ID 1',
            },
            {
              change_note: 'test updating license',
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
  editLicenseAmount(licenseInput: {license_id: 100, client_id: 1, course_id: 1, remaining_amount: 200, change_note: "test adding new license", workshop_id: 1}) {
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
  /* ---------------------- test license field resolvers ---------------------- */
  it('retreive field resolvers on license object', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
    query {
  getClient( client_id: 1) {
    client_id
    licenses {
      license_id
      license_changes {
        license_change_id
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
                  license_change_id: 1,
                  amount_change: 220,
                  updated_amount: 220,
                  change_note: 'added to program',
                },
                {
                  license_change_id: 2,
                  amount_change: -23,
                  updated_amount: 193,
                  change_note: 'Completed workshop: Workshop-ID 1',
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
                  license_change_id: 3,
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
})
