import { describe } from 'mocha'
import { prisma } from '../../src/prisma'
import {
  createMockApolloUser,
  createMockApolloAdmin,
  MockApolloTestRunners,
} from '../mockApollo'

/* ------------------------- test advisor resolvers ------------------------- */

describe('Advisor Resolvers', function () {
  /* ------------------- declare mockUser and initialize it ------------------- */
  let mockUser: MockApolloTestRunners
  let mockAdmin: MockApolloTestRunners

  before(async function () {
    mockUser = await createMockApolloUser()
    mockAdmin = await createMockApolloAdmin()
  })

  /* -------------------------------- run tests ------------------------------- */

  it('create advisor', async function () {
    await mockAdmin.confirmResponse({
      gqlScript: `
    mutation {
  addAdvisor(first_name: "first", last_name: "last", email: "test@test.com") {
    first_name
    last_name
    email
  }
}
    `,
      expectedResult: {
        addAdvisor: {
          first_name: 'first',
          last_name: 'last',
          email: 'test@test.com',
        },
      },
    })

    // confirm database updated as expected
    await mockAdmin.confirmDBUpdate({
      databaseQuery: prisma.advisors.count({
        where: {
          first_name: 'first',
          last_name: 'last',
          email: 'test@test.com',
        },
      }),
    })
  })
  it('reject creating advisor when email already registered', async function () {
    await mockAdmin.confirmError({
      gqlScript: `
    mutation {
  addAdvisor(first_name: "John", last_name: "Doe", email: "john.doe@email.com") {
    first_name
    last_name
    email
  }
}
    `,
      expectedErrorMessage:
        'Advisor with email "john.doe@email.com" already registered in the system',
    })
  })
  it('retrieve advisor', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
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
    unavailable_times {
      unavailable_start_time
      unavailable_end_time
    }
    }
  } 
    `,
      expectedResult: {
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
          unavailable_times: [
            {
              unavailable_start_time: '2021-10-22T01:00:00.000Z',
              unavailable_end_time: '2021-10-25T01:00:00.000Z',
            },
          ],
        },
      },
    })
  })
  it('retrieve advisor workshops via field resolver', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
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
    `,
      expectedResult: {
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
          requested_workshops: [],
        },
      },
    })
  })

  it('retrieve all advisors', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
    query {
  getAllAdvisors {
    first_name
    last_name
    email
  }
}
    `,
      expectedResult: {
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
    })
  })

  it('update advisor', async function () {
    await mockAdmin.confirmResponse({
      gqlScript: `
    mutation {
  editAdvisor(advisor_id: 1, email: "jane.doe@email.com", first_name: "Jane", last_name: "Doe") {
    first_name
    last_name
    email
  }
}
    `,
      expectedResult: {
        editAdvisor: {
          first_name: 'Jane',
          last_name: 'Doe',
          email: 'jane.doe@email.com',
        },
      },
    })

    // confirm database updated as expected
    await mockUser.confirmDBUpdate({
      databaseQuery: prisma.advisors.count({
        where: {
          advisor_id: 1,
          first_name: 'Jane',
          last_name: 'Doe',
          email: 'jane.doe@email.com',
        },
      }),
    })
  })
  it('reject update when new email already registered for other user', async function () {
    await mockAdmin.confirmError({
      gqlScript: `
    mutation {
  editAdvisor(advisor_id: 1, email: "henri@email.net", first_name: "John", last_name: "Doe") {
    first_name
    last_name
    email
  }
}
    `,
      expectedErrorMessage:
        'Email "henri@email.net" is already registered with an advisor in our system',
    })
  })
  it('delete advisor and remove related languages, regions, and unavailable_times', async function () {
    await mockAdmin.confirmResponse({
      gqlScript: `
    mutation {
  removeAdvisor(advisor_id: 5) {
    email
  }
}
    `,
      expectedResult: {
        removeAdvisor: {
          email: 'nathan.jameson@email.com',
        },
      },
    })

    // confirm database updated as expected
    // advisor removed
    await mockAdmin.confirmDBRemoval({
      databaseQuery: prisma.advisors.count({
        where: { advisor_id: 5 },
      }),
    })

    // advisor languages removed
    await mockAdmin.confirmDBRemoval({
      databaseQuery: prisma.languages.count({
        where: { advisor_id: 5 },
      }),
    })

    // advisor regions removed
    await mockAdmin.confirmDBRemoval({
      databaseQuery: prisma.regions.count({
        where: { advisor_id: 5 },
      }),
    })

    // advisor notes removed
    await mockAdmin.confirmDBRemoval({
      databaseQuery: prisma.advisor_notes.count({
        where: { advisor_id: 5 },
      }),
    })

    // unavailable days removed
    await mockAdmin.confirmDBRemoval({
      databaseQuery: prisma.advisor_unavailable_times.count({
        where: { advisor_id: 5 },
      }),
    })
  })
  it('reject deleting advisor when workshops have been scheduled to them', async function () {
    await mockAdmin.confirmError({
      gqlScript: `
    mutation {
  removeAdvisor(advisor_id: 1) {
    email
  }
}
    `,
      expectedErrorMessage:
        'Advisor #1 cannot be deleted because this advisor currently has past or present workshops assigned',
    })
  })
  it('reject deleting advisor when they have been requested for workshops', async function () {
    await mockAdmin.confirmError({
      gqlScript: `
    mutation {
  removeAdvisor(advisor_id: 2) {
    email
  }
}
    `,
      expectedErrorMessage:
        'Advisor #2 cannot be deleted because this advisor currently has past or present workshops assigned',
    })
  })
  it('change advisor active status', async function () {
    await mockAdmin.confirmResponse({
      gqlScript: `
      mutation {
        changeAdvisorActiveStatus(advisor_id: 5, active: false) {
          advisor_id
          email
          active
        }
      }
      `,
      expectedResult: {
        changeAdvisorActiveStatus: {
          advisor_id: 5,
          email: 'nathan.jameson@email.com',
          active: false,
        },
      },
    })

    await mockAdmin.confirmDBUpdate({
      databaseQuery: prisma.advisors.count({
        where: { advisor_id: 5, active: false },
      }),
    })
  })
  it('reject changing advisor active status if not admin', async function () {
    await mockUser.confirmError({
      gqlScript: `
    mutation {
      changeAdvisorActiveStatus(advisor_id: 5, active: false) {
        advisor_id
        email
        active
      }
    }
    `,
      expectedErrorMessage:
        "Access denied! You don't have permission for this action!",
    })
  })
  it('reject deactivating advisor if current or future workshops scheduled', async function () {
    await mockAdmin.confirmError({
      gqlScript: `
    mutation {
      changeAdvisorActiveStatus(advisor_id: 1, active: false) {
        advisor_id
        email
        active
      }
    }
    `,
      expectedErrorMessage:
        'Advisor cannote be deactivated as they have upcoming workshops scheduled',
    })
  })
  it('reject changing advisor if not admin', async function () {
    await mockUser.confirmError({
      gqlScript: `
    mutation {
      addAdvisor(first_name: "only", last_name: "admin", email: "allowed@allowed.com") {
        advisor_id
        email
      }
    }
    `,
      expectedErrorMessage:
        "Access denied! You don't have permission for this action!",
    })

    await mockUser.confirmError({
      gqlScript: `
  mutation {
    editAdvisor(advisor_id: 1, email: "please@dontwork.com", first_name: "no", last_name: "access") {
      advisor_id
      email
    }
  }
    `,
      expectedErrorMessage:
        "Access denied! You don't have permission for this action!",
    })

    await mockUser.confirmError({
      gqlScript: `
    mutation {
      removeAdvisor(advisor_id: 1) {
        advisor_id
        email
      }
    }
    `,
      expectedErrorMessage:
        "Access denied! You don't have permission for this action!",
    })
  })
})
