import { describe } from 'mocha'
import { expect } from 'chai'
import { testQuery } from '../queryTester'
import { prisma } from '../../src/prisma'

/* --------------------- test adjusting advisor regions --------------------- */

describe('Region Resolvers', async function () {
  // no need to retrieve regions directly, as these will be retrieved via
  // a field resolver on the Advisor object
  it('add region to advisor', async function () {
    const result = await testQuery(`#graphql
    mutation {
  addAdvisorRegion(advisor_id: 1, advisor_region: APAC) {
    advisor_id
    advisor_region
  }
}
    `)

    const expectedResult = {
      data: {
        addAdvisorRegion: {
          advisor_id: 1,
          advisor_region: 'APAC',
        },
      },
    }

    expect(result.data).to.eql(expectedResult)

    // confirm database updated as expected
    const checkDB = await prisma.regions.count({
      where: { advisor_id: 1, advisor_region: 'APAC' },
    })
    expect(checkDB).to.eql(1)
  })
  it('return current listing if advisor / region combination already registered', async function () {
    const result = await testQuery(`#graphql
    mutation {
  addAdvisorRegion(advisor_id: 1, advisor_region: NAM) {
    advisor_id
    region_id
    advisor_region
  }
}
    `)

    const expectedResult = {
      data: {
        addAdvisorRegion: {
          advisor_id: 1,
          region_id: 1,
          advisor_region: 'NAM',
        },
      },
    }

    expect(result.data).to.eql(expectedResult)

    // confirm database updated as expected
    const checkDB = await prisma.regions.count({
      where: { advisor_id: 1, region_id: 1, advisor_region: 'NAM' },
    })
    expect(checkDB).to.eql(1)
  })

  it('remove region from advisor', async function () {
    const result = await testQuery(`#graphql
    mutation {
  removeAdvisorRegion(region_id: 1) {
    advisor_id
    region_id
    advisor_region
  }
}
    `)

    const expectedResult = {
      data: {
        removeAdvisorRegion: {
          advisor_id: 1,
          region_id: 1,
          advisor_region: 'NAM',
        },
      },
    }

    expect(result.data).to.eql(expectedResult)

    // confirm database updated as expected
    const checkDB = await prisma.regions.count({
      where: { region_id: 1 },
    })
    expect(checkDB).to.eql(0)
  })
})
