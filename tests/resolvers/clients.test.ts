import { describe } from 'mocha'
import { expect } from 'chai'
import { testQuery } from '../queryTester'
import { prisma } from '../../src/prisma'

/* --------------------- test client CRUD and validation -------------------- */

describe('Client Resolvers', async function () {
  it('create client', async function () {
    const result = await testQuery(`#graphql
      mutation {
        addClient(client_name: "test_client", business_unit: "test_BU") {
          client_name
          business_unit
        }
      }
      `)

    const expectedResult = {
      data: {
        addClient: {
          client_name: 'test_client',
          business_unit: 'test_BU',
        },
      },
    }
    expect(result.data).to.eql(expectedResult)

    // confirm database updated as expected
    const checkDB = await prisma.clients.count({
      where: { client_name: 'test_client', business_unit: 'test_BU' },
    })
    expect(checkDB).to.eql(1)
  })
  it('reject creating client when client name + business unit already registered', async function () {
    const result = await testQuery(`#graphql
      mutation {
        addClient(client_name: "Acme Corp", business_unit: "Chemical Engineering") {
          client_id
          client_name
          business_unit
        }
      }
      `)

    const expectedErrorMessage =
      'This client has already been registered in the system'
    expect(result.data.data).to.eql(null)
    expect(result.data.errors[0].message).to.eql(expectedErrorMessage)
  })
  it('retrieve client', async function () {
    const result = await testQuery(`#graphql
     query {
            getClient(client_id: 1) {
              client_id
              client_name
              business_unit
            }
          }
          `)

    const expectedResult = {
      data: {
        getClient: {
          client_id: 1,
          client_name: 'Acme Corp',
          business_unit: 'Chemical Engineering',
        },
      },
    }

    expect(result.data).to.eql(expectedResult)
  })
  it('retrieve all clients', async function () {
    const result = await testQuery(`#graphql
    {
        getAllClients {
          client_id
          client_name
          business_unit
        }
      }
    `)

    const expectedResult = {
      data: {
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
    }
    expect(result.data).to.eql(expectedResult)
  })
  it('retrieve field resolvers for client_notes, licenses, and workshops', async function () {
    const result = await testQuery(`#graphql
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
    `)

    const expectedResult = {
      data: {
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
                  change_note: 'Completed workshop: Workshop-ID 1',
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
    }

    expect(result.data).to.eql(expectedResult)
  })
  it('update client', async function () {
    const result = await testQuery(`#graphql
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
      `)

    const expectedResult = {
      data: {
        editClient: {
          client_id: 1,
          client_name: 'updated_test_client',
          business_unit: 'updated_test_BU',
        },
      },
    }
    expect(result.data).to.eql(expectedResult)

    // confirm database updated as expected
    const checkDB = await prisma.clients.count({
      where: {
        client_id: 1,
        client_name: 'updated_test_client',
        business_unit: 'updated_test_BU',
      },
    })
    expect(checkDB).to.eql(1)
  })
  it('reject update when new client name + BU combination already registered for other user', async function () {
    const result = await testQuery(`#graphql
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
    `)

    const expectedErrorMessage = `client "Acme Corp" with business unit "Chemical Engineering" is already registered in the system`

    expect(result.data.data).to.be.null
    expect(result.data.errors[0].message).to.eql(expectedErrorMessage)
  })
  it('delete client without workshops or licenses', async function () {
    const result = await testQuery(`#graphql
      mutation {
  removeClient(
    client_id: 6
  ) {
    client_id
    client_name
    business_unit
  }
}
      `)

    const expectedResult = {
      data: {
        removeClient: {
          client_id: 6,
          client_name: 'Med Clinique',
          business_unit: null,
        },
      },
    }
    expect(result.data).to.eql(expectedResult)

    // confirm database updated as expected
    const checkDB = await prisma.clients.count({
      where: { client_id: 6 },
    })
    expect(checkDB).to.eql(0)
  })

  it('reject deleting client when client not found', async function () {
    const result = await testQuery(`#graphql
    mutation {
        removeClient(
            client_id: 100000
        ) {
            client_id
            client_name
            business_unit
        }
    }
    `)

    expect(result.data.data).to.be.null
    expect(result.data.errors[0].message).to.eql(`Client not found in database`)
  })
  it('reject deleting client when workshops have been scheduled to them', async function () {
    const result = await testQuery(`#graphql
    mutation {
  removeClient(
    client_id: 1
  ) {
    client_id
    client_name
    business_unit
  }
}
    `)

    expect(result.data.data).to.be.null
    expect(result.data.errors[0].message).to.eql(
      'Cannot remove client with past or present workshops assigned'
    )
  })
  it('reject deleting client with outstanding licenses', async function () {
    const result = await testQuery(`#graphql
      mutation {
  removeClient(
    client_id: 2
  ) {
    client_id
    client_name
    business_unit
  }
}
      `)

    expect(result.data.data).to.be.null
    expect(result.data.errors[0].message).to.eql(
      `Cannot remove client with outstanding licenses`
    )
  })
  it('deactivate client')
  it('add licenses + license change')
})
