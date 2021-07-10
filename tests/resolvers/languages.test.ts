import { describe } from 'mocha'
import { prisma } from '../../src/prisma'
import { createMockApolloUser, MockApolloTestRunners } from '../mockApollo'

/* -------------------- test adjusting advisor languages -------------------- */

// languages for an individual advisor will be retrieved
// through a relational query on the getAdvisor resolver

// the following language queries are for mutations and
// gathering data on all languages available

describe('Language Resolvers', function () {
  /* ------------------- declare mockUser and initialize it ------------------- */
  let mockUser: MockApolloTestRunners

  before(async function () {
    mockUser = await createMockApolloUser()
  })

  /* -------------------------------- run tests ------------------------------- */

  it('retrieve advisor through field resolver', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
      mutation {
  addAdvisorLanguage(language: "German", advisor_id: 1) {
    advisor_id
    advisor_language
    advisor {
      email
    }
  }
}
    `,
      expectedResult: {
        addAdvisorLanguage: {
          advisor_id: 1,
          advisor_language: 'German',
          advisor: {
            email: 'john.doe@email.com',
          },
        },
      },
    })
  })

  it('retrieve all advisor languages', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
    query {
  getAllAdvisorLanguages(language: null) {
    language_id
    advisor_language
  }
}
    `,
      expectedResult: {
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
    })
  })

  it('retrieve only advisors with language specified', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
      query {
  getAllAdvisorLanguages(language: "English") {
    language_id
    advisor_language
  }
}
    `,
      expectedResult: {
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
    })
  })

  it('add language to advisor', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
    mutation {
  addAdvisorLanguage(advisor_id: 1, language: "Japanese") {
    advisor_id
    advisor_language
  }
}
    `,
      expectedResult: {
        addAdvisorLanguage: {
          advisor_id: 1,
          advisor_language: 'Japanese',
        },
      },
    })

    await mockUser.confirmDBUpdate({
      databaseQuery: prisma.languages.count({
        where: { advisor_id: 1, advisor_language: 'Japanese' },
      }),
    })
  })
  it('reject if invalid language entered', async function () {
    await mockUser.confirmError({
      gqlScript: `
    mutation {
  addAdvisorLanguage(advisor_id: 1, language: "Klingon") {
    advisor_language
  }
}
    `,
      expectedErrorMessage: 'Please submit a valid language',
    })
  })

  it('remove language from advisor', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
    mutation {
  removeAdvisorLanguage(language_id: 1) {
    language_id
    advisor_id
    advisor_language
  }
}
    `,
      expectedResult: {
        removeAdvisorLanguage: {
          language_id: 1,
          advisor_id: 1,
          advisor_language: 'English',
        },
      },
    })

    await mockUser.confirmDBRemoval({
      databaseQuery: prisma.languages.count({ where: { language_id: 1 } }),
    })
  })
})
