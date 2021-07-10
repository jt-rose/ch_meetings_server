import { describe } from 'mocha'
import { prisma } from '../../src/prisma'
import { createMockApolloUser, MockApolloTestRunners } from '../mockApollo'

/* ----------------- test adjusting advisor unavailable days ---------------- */

describe('Unavailable Days Resolvers', function () {
  /* ------------------- declare mockUser and initialize it ------------------- */
  let mockUser: MockApolloTestRunners

  before(async function () {
    mockUser = await createMockApolloUser()
  })

  /* -------------------------------- run tests ------------------------------- */

  it('add unavailable day', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
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
    `,
      expectedResult: {
        addAdvisorUnavailableDay: {
          advisor_id: 1,
          day_unavailable: '2017-12-25T00:00:00.000Z',
          note: 'testing 123',
        },
      },
    })

    // confirm database updated as expected
    await mockUser.confirmDBUpdate({
      databaseQuery: prisma.unavailable_days.count({
        where: {
          advisor_id: 1,
          day_unavailable: '2017-12-25T00:00:00.000Z',
          note: 'testing 123',
        },
      }),
    })
  })
  it('reject adding if unavailable day conflicts with currently scheduled workshop sessions', async function () {
    await mockUser.confirmError({
      gqlScript: `
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
      `,
      expectedErrorMessage:
        'This advisor is currently scheduled for a workshop session on this date',
    })
  })
  it('edit unavailable day', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
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
    `,
      expectedResult: {
        editAdvisorUnavailableDay: {
          unavailable_id: 1,
          advisor_id: 1,
          day_unavailable: '2017-12-25T00:00:00.000Z',
          note: 'edit 123',
        },
      },
    })

    // confirm database updated as expected
    await mockUser.confirmDBUpdate({
      databaseQuery: prisma.unavailable_days.count({
        where: {
          unavailable_id: 1,
          advisor_id: 1,
          day_unavailable: '2017-12-25T00:00:00.000Z',
          note: 'edit 123',
        },
      }),
    })
  })
  it('reject editing if unavailable day conflicts with currently scheduled workshop sessions', async function () {
    await mockUser.confirmError({
      gqlScript: `
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
      `,
      expectedErrorMessage:
        'This advisor is currently scheduled for a workshop session on this date',
    })
  })
  it('remove unavailable day', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
    mutation {
  removeAdvisorUnavailableDay(unavailable_id: 1) {
    unavailable_id
    advisor_id
    day_unavailable
  }
}
    `,
      expectedResult: {
        removeAdvisorUnavailableDay: {
          unavailable_id: 1,
          advisor_id: 1,
          day_unavailable: '2021-10-22T00:00:00.000Z',
        },
      },
    })

    // confirm database updated as expected
    await mockUser.confirmDBRemoval({
      databaseQuery: prisma.unavailable_days.count({
        where: { unavailable_id: 1 },
      }),
    })
  })
})
