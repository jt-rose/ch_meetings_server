import { describe } from 'mocha'
import { expect } from 'chai'
import { testQuery } from '../queryTester'
import { seed } from '../../prisma/seed'
import { clear } from '../../prisma/clear'
import { prisma } from '../../src/prisma'

describe('Language Resolvers', async function () {
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

  /* -------------------- test adjusting advisor languages -------------------- */

  // languages for an individual advisor will be retrieved
  // through a relational query on the getAdvisor resolver

  // the following language queries are for mutations and
  // gathering data on all languages available
  it('retrieve advisor through field resolver', async function () {
    const result = await testQuery(`#graphql
      mutation {
  addAdvisorLanguage(language: "German", advisor_id: 1) {
    advisor_id
    advisor_language
    advisor {
      email
    }
  }
}
    `)

    const expectedResult = {
      data: {
        addAdvisorLanguage: {
          advisor_id: 1,
          advisor_language: 'German',
          advisor: {
            email: 'john.doe@email.com',
          },
        },
      },
    }

    expect(result.data).to.eql(expectedResult)
  })
  it('retrieve all advisor languages', async function () {
    const result = await testQuery(`#graphql
    query {
  getAllAdvisorLanguages(language: null) {
    language_id
    advisor_language
  }
}
    `)

    const expectedResult = {
      data: {
        getAllAdvisorLanguages: [
          {
            language_id: 1,
            advisor_language: 'English',
          },
          {
            language_id: 2,
            advisor_language: 'English',
          },
          {
            language_id: 3,
            advisor_language: 'French',
          },
          {
            language_id: 4,
            advisor_language: 'Japanese',
          },
          {
            language_id: 5,
            advisor_language: 'Chinese',
          },
          {
            language_id: 6,
            advisor_language: 'Spanish',
          },
          {
            language_id: 7,
            advisor_language: 'English',
          },
          {
            language_id: 8,
            advisor_language: 'Vietnamese',
          },
        ],
      },
    }

    expect(result.data).to.eql(expectedResult)
  })
  it('retrieve only advisors with language specified', async function () {
    const result = await testQuery(`#graphql
      query {
  getAllAdvisorLanguages(language: "English") {
    language_id
    advisor_language
  }
}
    `)

    const expectedResult = {
      data: {
        getAllAdvisorLanguages: [
          {
            language_id: 1,
            advisor_language: 'English',
          },
          {
            language_id: 2,
            advisor_language: 'English',
          },
          {
            language_id: 7,
            advisor_language: 'English',
          },
        ],
      },
    }

    expect(result.data).to.eql(expectedResult)
  })

  it('add language to advisor', async function () {
    const result = await testQuery(`#graphql
    mutation {
  addAdvisorLanguage(advisor_id: 1, language: "Japanese") {
    advisor_id
    advisor_language
  }
}
    `)

    const expectedResult = {
      data: {
        addAdvisorLanguage: {
          advisor_id: 1,
          advisor_language: 'Japanese',
        },
      },
    }

    expect(result.data).to.eql(expectedResult)

    const checkDB = await prisma.languages.count({
      where: { advisor_id: 1, advisor_language: 'Japanese' },
    })
    expect(checkDB).to.eql(1)
  })
  it('reject if invalid language entered', async function () {
    const result = await testQuery(`#graphql
    mutation {
  addAdvisorLanguage(advisor_id: 1, language: "Klingon") {
    advisor_language
  }
}
    `)

    expect(result.data.data).to.be.null
    expect(result.data.errors[0].message).to.eql(
      'Please submit a valid language'
    )
  })
  it('remove language from advisor', async function () {
    const result = await testQuery(`#graphql
    mutation {
  removeAdvisorLanguage(language_id: 1) {
    language_id
    advisor_id
    advisor_language
  }
}
    `)

    const expectedResult = {
      data: {
        removeAdvisorLanguage: {
          language_id: 1,
          advisor_id: 1,
          advisor_language: 'English',
        },
      },
    }

    expect(result.data).to.eql(expectedResult)

    const checkDB = await prisma.languages.count({ where: { language_id: 1 } })
    expect(checkDB).to.eql(0)
  })
})
