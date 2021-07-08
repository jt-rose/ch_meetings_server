import { describe } from 'mocha'
import { expect } from 'chai'
import { testQuery } from '../queryTester'
import { prisma } from '../../src/prisma'

/* ------------------------- test advisor resolvers ------------------------- */

describe('Advisor Resolvers', async function () {
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

    // confirm database updated as expected
    const checkDB = await prisma.advisors.count({
      where: { first_name: 'first', last_name: 'last', email: 'test@test.com' },
    })
    expect(checkDB).to.eql(1)
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
              day_unavailable: '2021-10-22T00:00:00.000Z',
            },
            {
              day_unavailable: '2021-10-23T00:00:00.000Z',
            },
            {
              day_unavailable: '2021-10-24T00:00:00.000Z',
            },
            {
              day_unavailable: '2021-10-25T00:00:00.000Z',
            },
          ],
        },
      },
    }

    expect(result.data).to.eql(expectedResult)
  })
  it('retrieve advisor workshops via field resolver', async function () {
    const result = await testQuery(`#graphql
    query {
  getAdvisor(advisor_id: 1) {
    advisor_id
    email
    assigned_workshops {
      workshop_id
    }
    requested_workshops {
      workshop_id
    }
  }
}
    `)

    const expectedResult = {
      data: {
        getAdvisor: {
          advisor_id: 1,
          email: 'john.doe@email.com',
          assigned_workshops: [
            {
              workshop_id: 1,
            },
            {
              workshop_id: 4,
            },
          ],
          requested_workshops: [
            {
              workshop_id: 6,
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

    // confirm database updated as expected
    const checkDB = await prisma.advisors.count({
      where: {
        advisor_id: 1,
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane.doe@email.com',
      },
    })
    expect(checkDB).to.eql(1)
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
  it('delete advisor and remove related languages, regions, and unavailable_days', async function () {
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

    // confirm database updated as expected
    const checkDBAdvisor = await prisma.advisors.count({
      where: { advisor_id: 5 },
    })
    expect(checkDBAdvisor).to.eql(0)

    const checkDBLanguages = await prisma.languages.count({
      where: { advisor_id: 5 },
    })
    expect(checkDBLanguages).to.eql(0)

    const checkDBRegions = await prisma.regions.count({
      where: { advisor_id: 5 },
    })
    expect(checkDBRegions).to.eql(0)

    const checkDBAdvisorNotes = await prisma.advisor_notes.count({
      where: { advisor_id: 5 },
    })
    expect(checkDBAdvisorNotes).to.eql(0)

    const checkDBUnavailableDays = await prisma.unavailable_days.count({
      where: { advisor_id: 5 },
    })
    expect(checkDBUnavailableDays).to.eql(0)
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

  it('reject deleting advisor when they have been requested for workshops', async function () {
    const result = await testQuery(`#graphql
    mutation {
  removeAdvisor(advisor_id: 4) {
    email
  }
}
    `)

    const expectedErrorMessage =
      'Advisor #4 has been requested for workshops. Please clear this request before removing the advisor.'
    expect(result.data.data).to.eql(null)
    expect(result.data.errors[0].message).to.eql(expectedErrorMessage)
  })
  it('deactivate advisor')
})
