import { describe } from 'mocha'
import { prisma } from '../../src/prisma'
import { createMockApolloUser, MockApolloTestRunners } from '../mockApollo'

/* ---------------------- test adjusting advisor notes ---------------------- */
describe('Advisor Notes Resolvers', function () {
  /* ------------------- declare mockUser and initialize it ------------------- */
  let mockUser: MockApolloTestRunners

  before(async function () {
    mockUser = await createMockApolloUser()
  })

  /* -------------------------------- run tests ------------------------------- */
  it('add new advisor note', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
      mutation {
    addAdvisorNote(advisor_id: 1, advisor_note: "This is a new note") {
      advisor_id
      advisor_note
    }
  }
      `,
      expectedResult: {
        addAdvisorNote: {
          advisor_id: 1,
          advisor_note: 'This is a new note',
        },
      },
    })

    // confirm database updated as expected
    await mockUser.confirmDBUpdate({
      databaseQuery: prisma.advisor_notes.count({
        where: { advisor_id: 1, advisor_note: 'This is a new note' },
      }),
    })
    /*const checkDB = await prisma.advisor_notes.count({
        where: { advisor_id: 1, advisor_note: 'This is a new note' },
      })
      expect(checkDB).to.eql(1)*/
  })
  // advisor notes will be retrieved via the Advisor field resolver
  it('edit advisor note', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
      mutation {
    editAdvisorNote(note_id: 1, advisor_note: "This is an edited note") {
      advisor_id
      note_id
      advisor_note
    }
  }
      `,
      expectedResult: {
        editAdvisorNote: {
          advisor_id: 1,
          note_id: 1,
          advisor_note: 'This is an edited note',
        },
      },
    })

    await mockUser.confirmDBUpdate({
      databaseQuery: prisma.advisor_notes.count({
        where: {
          advisor_id: 1,
          note_id: 1,
          advisor_note: 'This is an edited note',
        },
      }),
    })
  })
  it('remove advisor note', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
      mutation {
    removeAdvisorNote(note_id: 1) {
      advisor_id
      note_id
      advisor_note
    }
  }
      `,
      expectedResult: {
        removeAdvisorNote: {
          advisor_id: 1,
          note_id: 1,
          advisor_note: 'Can travel to EMEA occasionally with 3+ months notice',
        },
      },
    })

    // confirm database updated as expected
    await mockUser.confirmDBRemoval({
      databaseQuery: prisma.advisor_notes.count({ where: { note_id: 1 } }),
    })
  })
})
//})
