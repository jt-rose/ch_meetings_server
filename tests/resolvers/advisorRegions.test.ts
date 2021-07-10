import { describe } from 'mocha'
import { prisma } from '../../src/prisma'
import { createMockApolloUser, MockApolloTestRunners } from '../mockApollo'

/* --------------------- test adjusting advisor regions --------------------- */

describe('Region Resolvers', function () {
  /* ------------------- declare mockUser and initialize it ------------------- */
  let mockUser: MockApolloTestRunners

  before(async function () {
    mockUser = await createMockApolloUser()
  })

  /* -------------------------------- run tests ------------------------------- */

  // no need to retrieve regions directly, as these will be retrieved via
  // a field resolver on the Advisor object
  it('add region to advisor', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
    mutation {
  addAdvisorRegion(advisor_id: 1, advisor_region: APAC) {
    advisor_id
    advisor_region
  }
}
    `,
      expectedResult: {
        addAdvisorRegion: {
          advisor_id: 1,
          advisor_region: 'APAC',
        },
      },
    })

    // confirm database updated as expected
    await mockUser.confirmDBUpdate({
      databaseQuery: prisma.regions.count({
        where: { advisor_id: 1, advisor_region: 'APAC' },
      }),
    })
  })
  it('return current listing if advisor / region combination already registered', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
    mutation {
  addAdvisorRegion(advisor_id: 1, advisor_region: NAM) {
    advisor_id
    region_id
    advisor_region
  }
}
    `,
      expectedResult: {
        addAdvisorRegion: {
          advisor_id: 1,
          region_id: 1,
          advisor_region: 'NAM',
        },
      },
    })

    // confirm database updated as expected
    await mockUser.confirmDBUpdate({
      databaseQuery: prisma.regions.count({
        where: { advisor_id: 1, region_id: 1, advisor_region: 'NAM' },
      }),
    })
  })

  it('remove region from advisor', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
    mutation {
  removeAdvisorRegion(region_id: 1) {
    advisor_id
    region_id
    advisor_region
  }
}
    `,
      expectedResult: {
        removeAdvisorRegion: {
          advisor_id: 1,
          region_id: 1,
          advisor_region: 'NAM',
        },
      },
    })

    // confirm database enry deleted as expected
    await mockUser.confirmDBRemoval({
      databaseQuery: prisma.regions.count({
        where: { region_id: 1 },
      }),
    })
  })
})
