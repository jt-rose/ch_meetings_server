import { describe } from 'mocha'
import { expect } from 'chai'
import { testQuery } from '../queryTester'
import { seed } from '../../prisma/seed'
import { clear } from '../../prisma/clear'

describe('Unavailable Days Resolvers', async function () {
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

  /* ----------------- test adjusting advisor unavailable days ---------------- */

  it('add unavailable day', async function () {
    const result = await testQuery(`#graphql
    mutation {
  addAdvisorUnavailableDay( unavailable_day_info: {
    advisor_id: 1,
		day_unavailable: "2017-12-25",
    note: "testing 123"
  }) {
    advisor_id
    day_unavailable
    note
  }
}
    `)

    const expectedResult = {
      data: {
        addAdvisorUnavailableDay: {
          advisor_id: 1,
          day_unavailable: '2017-12-25T00:00:00.000Z',
          note: 'testing 123',
        },
      },
    }

    expect(result.data).to.eql(expectedResult)
  })
  it('reject adding if unavailable day conflicts with currently scheduled workshop sessions', async function () {
    const result = await testQuery(`#graphql
      mutation {
  addAdvisorUnavailableDay( unavailable_day_info: {
    advisor_id: 1,
		day_unavailable: "2021-07-21",
    note: "add new 123"
  }) {
    unavailable_id
    advisor_id
    day_unavailable
    note
  }
}
      `)

    const expectedErrorMessage =
      'This advisor is currently scheduled for a workshop session on this date'
    expect(result.data.data).to.eql(null)
    expect(result.data.errors[0].message).to.eql(expectedErrorMessage)
  })
  it('edit unavailable day', async function () {
    const result = await testQuery(`#graphql
    mutation {
  editAdvisorUnavailableDay( unavailable_day_info: {
    unavailable_id: 1,
    advisor_id: 1,
		day_unavailable: "2017-12-25",
    note: "edit 123"
  }) {
    unavailable_id
    advisor_id
    day_unavailable
    note
  }
}
    `)

    const expectedResult = {
      data: {
        editAdvisorUnavailableDay: {
          unavailable_id: 1,
          advisor_id: 1,
          day_unavailable: '2017-12-25T00:00:00.000Z',
          note: 'edit 123',
        },
      },
    }

    expect(result.data).to.eql(expectedResult)
  })
  it('reject editing if unavailable day conflicts with currently scheduled workshop sessions', async function () {
    const result = await testQuery(`#graphql
      mutation {
  editAdvisorUnavailableDay( unavailable_day_info: {
    unavailable_id: 1
    advisor_id: 1,
		day_unavailable: "2021-07-21",
    note: "edit 123"
  }) {
    unavailable_id
    advisor_id
    day_unavailable
    note
  }
}
      `)

    const expectedErrorMessage =
      'This advisor is currently scheduled for a workshop session on this date'
    expect(result.data.data).to.eql(null)
    expect(result.data.errors[0].message).to.eql(expectedErrorMessage)
  })
  it('remove unavailable day', async function () {
    const result = await testQuery(`#graphql
    mutation {
  removeAdvisorUnavailableDay(unavailable_id: 1) {
    unavailable_id
    advisor_id
    day_unavailable
  }
}
    `)

    const expectedResult = {
      data: {
        removeAdvisorUnavailableDay: {
          unavailable_id: 1,
          advisor_id: 1,
          day_unavailable: '2021-10-22T00:00:00.000Z',
        },
      },
    }

    expect(result.data).to.eql(expectedResult)
  })
})
