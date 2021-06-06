import { describe } from 'mocha'
import { expect } from 'chai'
import { testQuery } from '../queryTester'
import { seed } from '../../prisma/seed'
import { clear } from '../../prisma/clear'

describe('Advisor Resolvers', async function () {
  /* ------------------- seed and clear DB before each test ------------------- */

  before('clear any data at the start', async function () {
    await clear()
  })

  beforeEach('seed database', async function () {
    await seed()
  })

  afterEach('clear database', async function () {
    await clear()
  })

  after('restore database for local testing', async function () {
    await seed()
  })

  /* ------------------------- test CRUD functionality ------------------------ */

  it('create advisor', async function () {
    const result = await testQuery(`#graphql
    mutation {
  addAdvisor(first_name: "first", last_name: "last", email: "test@test.com") {
    first_name
    last_name
    email
  }
}
    `)

    const expectedResult = {
      data: {
        addAdvisor: {
          first_name: 'first',
          last_name: 'last',
          email: 'test@test.com',
        },
      },
    }

    expect(result.data).to.eql(expectedResult)
  })
  it('reject creating advisor when email already registered', async function () {
    const result = await testQuery(`#graphql
    mutation {
  addAdvisor(first_name: "John", last_name: "Doe", email: "john.doe@email.com") {
    first_name
    last_name
    email
  }
}
    `)

    const expectedErrorMessage =
      'Advisor with email "john.doe@email.com" already registered in the system'
    expect(result.data.data).to.eql(null)
    expect(result.data.errors[0].message).to.eql(expectedErrorMessage)
  })
  it('retrieve advisor', async function () {
    const result = await testQuery(`#graphql
     query {
  getAdvisor(advisor_id: 1) {
    first_name
    last_name
    email
    languages {
      advisor_language
      }
    regions {
      advisor_region
    }
    unavailable_days {
      day_unavailable
    }
    }
  } 
    `)

    const expectedResult = {
      data: {
        getAdvisor: {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@email.com',
          languages: [
            {
              advisor_language: 'English',
            },
          ],
          regions: [
            {
              advisor_region: 'NAM',
            },
          ],
          unavailable_days: [
            {
              day_unavailable: 1634860800000,
            },
            {
              day_unavailable: 1634947200000,
            },
            {
              day_unavailable: 1635033600000,
            },
            {
              day_unavailable: 1635120000000,
            },
          ],
        },
      },
    }

    expect(result.data).to.eql(expectedResult)
  })

  it('retrieve all advisors', async function () {
    const result = await testQuery(`#graphql
    query {
  getAllAdvisors {
    first_name
    last_name
    email
  }
}
    `)

    const expectedResult = {
      data: {
        getAllAdvisors: [
          {
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@email.com',
          },
          {
            first_name: 'Henri',
            last_name: 'Bonaparte',
            email: 'henri@email.net',
          },
          {
            first_name: 'Yusuke',
            last_name: 'Suzumura',
            email: 'yusuke@tokyo.co.jp',
          },
          {
            first_name: 'Jorge',
            last_name: 'Esteban',
            email: 'jorge@advisor.net',
          },
          {
            first_name: 'Nathan',
            last_name: 'Jameson',
            email: 'nathan.jameson@email.com',
          },
        ],
      },
    }

    expect(result.data).to.eql(expectedResult)
  })
  /* ------------------------ test updating an advisor ------------------------ */
  it('update advisor', async function () {
    const result = await testQuery(`#graphql
    mutation {
  editAdvisor(advisor_id: 1, email: "jane.doe@email.com", first_name: "Jane", last_name: "Doe") {
    first_name
    last_name
    email
  }
}
    `)

    const expectedResult = {
      data: {
        editAdvisor: {
          first_name: 'Jane',
          last_name: 'Doe',
          email: 'jane.doe@email.com',
        },
      },
    }

    expect(result.data).to.eql(expectedResult)
  })
  it('reject update when new email already registered for other user', async function () {
    const result = await testQuery(`#graphql
    mutation {
  editAdvisor(advisor_id: 1, email: "henri@email.net", first_name: "John", last_name: "Doe") {
    first_name
    last_name
    email
  }
}
    `)

    const expectedErrorMessage =
      'Email "henri@email.net" is already registered with an advisor in our system'
    expect(result.data.data).to.eql(null)
    expect(result.data.errors[0].message).to.eql(expectedErrorMessage)
  })
  it.skip('delete advisor and remove related languages, regions, and unavailable_days', async function () {
    const result = await testQuery(`#graphql
    mutation {
  removeAdvisor(advisor_id: 5) {
    email
  }
}
    `)

    const expectedResult = {
      data: {
        removeAdvisor: {
          email: 'nathan.jameson@email.com',
        },
      },
    }
    // need to add check for removing related data once field resolvers are built
    expect(result.data).to.eql(expectedResult)
  })
  it('reject deleting advisor when workshops have been scheduled to them', async function () {
    const result = await testQuery(`#graphql
    mutation {
  removeAdvisor(advisor_id: 1) {
    email
  }
}
    `)

    const expectedErrorMessage =
      'Advisor #1 cannot be deleted because this advisor currently has past or present workshops assigned'
    expect(result.data.data).to.eql(null)
    expect(result.data.errors[0].message).to.eql(expectedErrorMessage)
  })

  it('reject deleting advisor when they have been requested for workshops')

  /* ---------------------- test adjusting advisor notes ---------------------- */

  it('add new advisor note')
  it('retrieve advisor notes')
  it('edit advisor note')
  it('remove advisor note')
})
