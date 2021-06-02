import { describe } from 'mocha'
import { expect } from 'chai'
import { testQuery } from '../queryTester'
import { seed } from '../../prisma/seed'
import { clear } from '../../prisma/clear'

before('clear any data at the start', async () => {
  await clear()
})

beforeEach('seed database', async () => {
  await seed()
})

afterEach('clear database', async () => {
  await clear()
})

describe('Client Resolvers', () => {
  it('create client', async () => {
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
  })
  it('reject creating client when client name + business unit already registered', async () => {
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
  it('retrieve client', async () => {
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
  it('retrieve all clients', async () => {
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
        ],
      },
    }
    expect(result.data).to.eql(expectedResult)
  })
  it('update client', async () => {
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
  })
  it('reject update when new client name + BU combination already registered for other user', async () => {
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
  it('delete client without workshops', async () => {
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

    const expectedResult = {
      data: {
        removeClient: {
          client_id: 2,
          client_name: 'Acme Corp',
          business_unit: 'Software Integration',
        },
      },
    }
    expect(result.data).to.eql(expectedResult)
  })
  it('reject deleting client when client not found', async () => {
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
  it('reject deleting client when workshops have been scheduled to them', async () => {
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
})
