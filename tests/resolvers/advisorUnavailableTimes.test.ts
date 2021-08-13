import { describe } from 'mocha'
import { prisma } from '../../src/prisma'
import { createMockApolloUser, MockApolloTestRunners } from '../mockApollo'

/* ----------------- test adjusting advisor unavailable days ---------------- */

describe('Unavailable Times Resolvers', function () {
  /* ------------------- declare mockUser and initialize it ------------------- */
  let mockUser: MockApolloTestRunners

  before(async function () {
    mockUser = await createMockApolloUser()
  })

  /* -------------------------------- run tests ------------------------------- */

  it('add unavailable time', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
      mutation {
        addAdvisorUnavailableTime(unavailable_time_info: {
          advisor_id: 1, 
          unavailable_start_time: "Aug 21 2021 06:00:00 GMT-0400 (Eastern Daylight Time)",
    unavailable_end_time: "Aug 21 2021 08:00:00 GMT-0400 (Eastern Daylight Time)",
          note: "This is a test"
        }) {
          ...on AdvisorUnavailableTime {
            advisor_id
            unavailable_start_time
            unavailable_end_time
            note
          }
          ...on TimeConflictError {
            conflictType
            timeConflicts {
              start_time
              end_time
            }
          }
        }
      }
    `,
      expectedResult: {
        addAdvisorUnavailableTime: {
          advisor_id: 1,
          unavailable_start_time: '2021-08-21T10:00:00.000Z',
          unavailable_end_time: '2021-08-21T12:00:00.000Z',
          note: 'This is a test',
        },
      },
    })

    // confirm database updated as expected
    await mockUser.confirmDBUpdate({
      databaseQuery: prisma.advisor_unavailable_times.count({
        where: {
          advisor_id: 1,
          unavailable_start_time: '2021-08-21T10:00:00.000Z',
          unavailable_end_time: '2021-08-21T12:00:00.000Z',
          note: 'This is a test',
        },
      }),
    })
  })
  it('reject adding if unavailable time conflicts with currently scheduled workshop sessions', async function () {
    await mockUser.confirmTimeConflictError({
      gqlScript: `
      mutation {
  addAdvisorUnavailableTime( unavailable_time_info: {
    advisor_id: 1,
		unavailable_start_time: "Wed Jul 21 2021 06:00:00 GMT-0400 (Eastern Daylight Time)",
    unavailable_end_time: "Wed Jul 21 2021 08:00:00 GMT-0400 (Eastern Daylight Time)",
    note: "add new 123"
  }) {
    ...on AdvisorUnavailableTime {
    advisor_id
    unavailable_start_time
    unavailable_end_time
  }
  ...on TimeConflictError {
    conflictType
    timeConflicts {
      start_time
      end_time
    }
  }
}
}
      `,
      timeConflictError: {
        addAdvisorUnavailableTime: {
          conflictType: 'Workshop Session',
          timeConflicts: [
            {
              start_time: '2021-07-21T11:00:00.000Z',
              end_time: '2021-07-21T11:30:00.000Z',
            },
            {
              start_time: '2021-07-21T12:00:00.000Z',
              end_time: '2021-07-21T13:00:00.000Z',
            },
          ],
        },
      },
    })
  })
  it('reject adding unavailable time if unavailable time already scheduled', async () => {
    await mockUser.confirmTimeConflictError({
      gqlScript: `
      mutation {
  addAdvisorUnavailableTime( unavailable_time_info: {
    advisor_id: 1,
		unavailable_start_time: "Oct 22 2021 21:00:00 GMT-0400 (Eastern Daylight Time)",
    unavailable_end_time: "Oct 23 2021 21:00:00 GMT-0400 (Eastern Daylight Time)",
    note: "add new 123"
  }) {
    ...on AdvisorUnavailableTime {
    advisor_id
    unavailable_start_time
    unavailable_end_time
  }
  ...on TimeConflictError {
    conflictType
    timeConflicts {
      start_time
      end_time
    }
  }
}
}
      `,
      timeConflictError: {
        addAdvisorUnavailableTime: {
          conflictType: 'Advisor Unavailable Times',
          timeConflicts: [
            {
              start_time: '2021-10-22T01:00:00.000Z',
              end_time: '2021-10-25T01:00:00.000Z',
            },
          ],
        },
      },
    })
  })
  it('edit unavailable time', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
    mutation {
  editAdvisorUnavailableTime( unavailable_time_info: {
    unavailable_id: 1,
    advisor_id: 1,
		unavailable_start_time: "Aug 21 2021 06:00:00 GMT-0400 (Eastern Daylight Time)",
    unavailable_end_time: "Aug 21 2021 08:00:00 GMT-0400 (Eastern Daylight Time)",
    note: "edit 123"
  }) {
    ...on AdvisorUnavailableTime {
    advisor_id
    unavailable_start_time
    unavailable_end_time
  }
  ...on TimeConflictError {
    conflictType
    timeConflicts {
      start_time
      end_time
    }
  }
}
}
    `,
      expectedResult: {
        editAdvisorUnavailableTime: {
          advisor_id: 1,
          unavailable_start_time: '2021-08-21T10:00:00.000Z',
          unavailable_end_time: '2021-08-21T12:00:00.000Z',
        },
      },
    })

    // confirm database updated as expected
    await mockUser.confirmDBUpdate({
      databaseQuery: prisma.advisor_unavailable_times.count({
        where: {
          unavailable_id: 1,
          advisor_id: 1,
          unavailable_start_time: '2021-08-21T10:00:00.000Z',
          unavailable_end_time: '2021-08-21T12:00:00.000Z',
          note: 'edit 123',
        },
      }),
    })
  })
  it('reject editing if unavailable time conflicts with currently scheduled workshop sessions', async function () {
    await mockUser.confirmTimeConflictError({
      gqlScript: `
      mutation {
  editAdvisorUnavailableTime( unavailable_time_info: {
    unavailable_id: 1
    advisor_id: 1,
		unavailable_start_time: "Wed Jul 21 2021 06:00:00 GMT-0400 (Eastern Daylight Time)",
    unavailable_end_time: "Wed Jul 21 2021 08:00:00 GMT-0400 (Eastern Daylight Time)",
    note: "edit 123"
  }) {
    ...on AdvisorUnavailableTime {
    advisor_id
    unavailable_start_time
    unavailable_end_time
  }
  ...on TimeConflictError {
    conflictType
    timeConflicts {
      start_time
      end_time
    }
  }
}
}
      `,
      timeConflictError: {
        editAdvisorUnavailableTime: {
          conflictType: 'Workshop Session',
          timeConflicts: [
            {
              start_time: '2021-07-21T11:00:00.000Z',
              end_time: '2021-07-21T11:30:00.000Z',
            },
            {
              start_time: '2021-07-21T12:00:00.000Z',
              end_time: '2021-07-21T13:00:00.000Z',
            },
          ],
        },
      },
    })
  })
  it('reject editing unavailable time if unavailable time already scheduled', async () => {
    await mockUser.confirmTimeConflictError({
      gqlScript: `
      mutation {
  editAdvisorUnavailableTime( unavailable_time_info: {
    unavailable_id: 2
    advisor_id: 2,
		unavailable_start_time: "2021-12-25T01:00:00Z",
    unavailable_end_time: "2021-12-25T23:59:59Z",
    note: "edit 123"
  }) {
    ...on AdvisorUnavailableTime {
    advisor_id
    unavailable_start_time
    unavailable_end_time
  }
  ...on TimeConflictError {
    conflictType
    timeConflicts {
      start_time
      end_time
    }
  }
}
}
      `,
      timeConflictError: {
        editAdvisorUnavailableTime: {
          conflictType: 'Advisor Unavailable Times',
          timeConflicts: [
            {
              start_time: '2021-12-25T01:00:00.000Z',
              end_time: '2021-12-25T23:59:59.000Z',
            },
          ],
        },
      },
    })
  })
  it('remove unavailable time', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
    mutation {
  removeAdvisorUnavailableTime(unavailable_id: 1) {
    unavailable_id
    advisor_id
    unavailable_start_time
    unavailable_end_time
  }
}
    `,
      expectedResult: {
        removeAdvisorUnavailableTime: {
          unavailable_id: 1,
          advisor_id: 1,
          unavailable_start_time: '2021-10-22T01:00:00.000Z',
          unavailable_end_time: '2021-10-25T01:00:00.000Z',
        },
      },
    })

    // confirm database updated as expected
    await mockUser.confirmDBRemoval({
      databaseQuery: prisma.advisor_unavailable_times.count({
        where: { unavailable_id: 1 },
      }),
    })
  })
})
