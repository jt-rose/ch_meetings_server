import { describe } from 'mocha'
import { prisma } from '../../src/prisma'
import { createMockApolloUser } from '../mockApollo'

describe('Advisor Notes Resolvers', async function () {
  /* ------------------- seed and clear DB before each test ------------------- */

  before('clear any data at the start', async function () {
    // instantiate mock apollo testing queries
    const { confirmResponse, confirmDBUpdate, confirmDBRemoval } =
      await createMockApolloUser()

    // attach to mocha 'this' context
    this.confirmResponse = confirmResponse
    this.confirmDBUpdate = confirmDBUpdate
    this.confirmDBRemoval = confirmDBRemoval
  })

  /* ---------------------- test adjusting advisor notes ---------------------- */

  it('add new advisor note', async function () {
    await this.confirmResponse({
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
    await this.confirmDBUpdate({
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
    await this.confirmResponse({
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
    /*
    const result = await testQuery(`#graphql
    mutation {
  editAdvisorNote(note_id: 1, advisor_note: "This is an edited note") {
    advisor_id
    note_id
    advisor_note
  }
}
    `)

    // confirm response object as expected
    const expectedResult = {
      data: {
        editAdvisorNote: {
          advisor_id: 1,
          note_id: 1,
          advisor_note: 'This is an edited note',
        },
      },
    }

    expect(result.data).to.eql(expectedResult)
*/
    await this.confirmDBUpdate({
      databaseQuery: prisma.advisor_notes.count({
        where: {
          advisor_id: 1,
          note_id: 1,
          advisor_note: 'This is an edited note',
        },
      }),
    })
    /*
    // confirm database updated as expected
    const checkDB = await prisma.advisor_notes.count({
      where: {
        advisor_id: 1,
        note_id: 1,
        advisor_note: 'This is an edited note',
      },
    })
    expect(checkDB).to.eql(1)*/
  })
  it('remove advisor note', async function () {
    await this.confirmResponse({
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
    await this.confirmDBRemoval({
      databaseQuery: prisma.advisor_notes.count({ where: { note_id: 1 } }),
    })
  })
})
