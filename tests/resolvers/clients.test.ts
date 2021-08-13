import { describe } from 'mocha'
import { prisma } from '../../src/prisma'
import { createMockApolloUser, MockApolloTestRunners } from '../mockApollo'

/* --------------------- test client CRUD and validation -------------------- */

describe('Client Resolvers', function () {
  /* ------------------- declare mockUser and initialize it ------------------- */
  let mockUser: MockApolloTestRunners

  before(async function () {
    mockUser = await createMockApolloUser()
  })

  /* -------------------------------- run tests ------------------------------- */

  it('create client', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
      mutation {
        addClient(client_name: "test_client", business_unit: "test_BU") {
          client_name
          business_unit
        }
      }
      `,
      expectedResult: {
        addClient: {
          client_name: 'test_client',
          business_unit: 'test_BU',
        },
      },
    })

    // confirm database updated as expected
    await mockUser.confirmDBUpdate({
      databaseQuery: prisma.clients.count({
        where: { client_name: 'test_client', business_unit: 'test_BU' },
      }),
    })
  })
  it('reject creating client when client name + business unit already registered', async function () {
    await mockUser.confirmError({
      gqlScript: `
      mutation {
        addClient(client_name: "Acme Corp", business_unit: "Chemical Engineering") {
          client_id
          client_name
          business_unit
        }
      }
      `,
      expectedErrorMessage:
        'This client has already been registered in the system',
    })
  })

  it('retrieve client', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
     query {
            getClient(client_id: 1) {
              client_id
              client_name
              business_unit
            }
          }
          `,
      expectedResult: {
        getClient: {
          client_id: 1,
          client_name: 'Acme Corp',
          business_unit: 'Chemical Engineering',
        },
      },
    })
  })

  it('retrieve all clients', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
    {
        getAllClients {
          client_id
          client_name
          business_unit
        }
      }
    `,
      expectedResult: {
        getAllClients: [
          {
            client_id: 1,
            client_name: 'Acme Corp',
            business_unit: 'Chemical Engineering',
          },
          {
            client_id: 2,
            client_name: 'Acme Corp',
            business_unit: 'Software Integration',
          },
          {
            client_id: 3,
            client_name: 'ABC Company',
            business_unit: null,
          },
          {
            client_id: 4,
            client_name: 'Financial Services',
            business_unit: 'Accounting',
          },
          {
            client_id: 5,
            client_name: 'Financial Services',
            business_unit: 'Investments',
          },
          {
            client_id: 6,
            client_name: 'Med Clinique',
            business_unit: null,
          },
        ],
      },
    })
  })

  it('retrieve field resolvers for client_notes, licenses, and workshops', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
    query {
  getClient(client_id: 1) {
    client_id
    client_name
    client_notes {
      note
    }
    licenses {
      course_id
      remaining_amount
      license_changes {
        change_note
      }
    }
    workshops {
      workshop_id
    }
  }
}
    `,
      expectedResult: {
        getClient: {
          client_id: 1,
          client_name: 'Acme Corp',
          client_notes: [
            {
              note: '70% of 2021 licenses should be used before October 2021',
            },
          ],
          licenses: [
            {
              course_id: 1,
              remaining_amount: 193,
              license_changes: [
                {
                  change_note: 'added to program',
                },
                {
                  change_note: 'Reserved 23 licenses for workshop ID: 1',
                },
                {
                  change_note:
                    'Completed workshop: Workshop-ID 1, finalized use of 23 licenses',
                },
              ],
            },
            {
              course_id: 3,
              remaining_amount: 35,
              license_changes: [
                {
                  change_note: 'added to program',
                },
              ],
            },
          ],
          workshops: [
            {
              workshop_id: 1,
            },
            {
              workshop_id: 2,
            },
            {
              workshop_id: 3,
            },
            {
              workshop_id: 7,
            },
          ],
        },
      },
    })
  })

  it('update client', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
      mutation {
  editClient(
    client_id: 1
    client_name: "updated_test_client"
    business_unit: "updated_test_BU"
  ) {
    client_id
    client_name
    business_unit
  }
}
      `,
      expectedResult: {
        editClient: {
          client_id: 1,
          client_name: 'updated_test_client',
          business_unit: 'updated_test_BU',
        },
      },
    })

    // confirm database updated as expected
    await mockUser.confirmDBUpdate({
      databaseQuery: prisma.clients.count({
        where: {
          client_id: 1,
          client_name: 'updated_test_client',
          business_unit: 'updated_test_BU',
        },
      }),
    })
  })
  it('reject update when new client name + BU combination already registered for other user', async function () {
    await mockUser.confirmError({
      gqlScript: `
    mutation {
  editClient(
    client_id: 2
    client_name: "Acme Corp"
    business_unit: "Chemical Engineering"
  ) {
    client_id
    client_name
    business_unit
  }
}
    `,
      expectedErrorMessage: `client "Acme Corp" with business unit "Chemical Engineering" is already registered in the system`,
    })
  })

  it('delete client without workshops or licenses', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
      mutation {
  removeClient(
    client_id: 6
  ) {
    client_id
    client_name
    business_unit
  }
}
      `,
      expectedResult: {
        removeClient: {
          client_id: 6,
          client_name: 'Med Clinique',
          business_unit: null,
        },
      },
    })

    // confirm database updated as expected
    await mockUser.confirmDBRemoval({
      databaseQuery: prisma.clients.count({
        where: { client_id: 6 },
      }),
    })
  })

  it('reject deleting client when client not found', async function () {
    await mockUser.confirmError({
      gqlScript: `
    mutation {
        removeClient(
            client_id: 100000
        ) {
            client_id
            client_name
            business_unit
        }
    }
    `,
      expectedErrorMessage: `Client not found in database`,
    })
  })

  it('reject deleting client when workshops have been scheduled to them', async function () {
    await mockUser.confirmError({
      gqlScript: `
    mutation {
  removeClient(
    client_id: 1
  ) {
    client_id
    client_name
    business_unit
  }
}
    `,
      expectedErrorMessage:
        'Cannot remove client with past or present workshops assigned',
    })
  })

  it('reject deleting client with outstanding licenses', async function () {
    await mockUser.confirmError({
      gqlScript: `
      mutation {
  removeClient(
    client_id: 2
  ) {
    client_id
    client_name
    business_unit
  }
}
      `,
      expectedErrorMessage: `Cannot remove client with outstanding licenses`,
    })
  })

  it('change client active status', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
    mutation {
      changeClientActiveStatus(client_id: 6, active: true) {
        client_id
        client_name
        active
      }
    }
    `,
      expectedResult: {
        changeClientActiveStatus: {
          client_id: 6,
          client_name: 'Med Clinique',
          active: true,
        },
      },
    })
    await mockUser.confirmDBUpdate({
      databaseQuery: prisma.clients.count({
        where: { client_id: 6, active: true },
      }),
    })
  })
  it('reject deactivating client with active workshops', async function () {
    await mockUser.confirmError({
      gqlScript: `
      mutation {
        changeClientActiveStatus(client_id: 1, active: false) {
          client_id
          client_name
          active
        }
      }
      `,
      expectedErrorMessage:
        'Client cannot be deactivated as they have upcoming workshops scheduled',
    })
  })
  it('add licenses + license change')
})
