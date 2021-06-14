import { describe } from 'mocha'
import { expect } from 'chai'
import { testQuery } from '../queryTester'
import { seed } from '../../prisma/seed'
import { clear } from '../../prisma/clear'
import { prisma } from '../../src/prisma'

describe('Advisor Notes Resolvers', async function () {
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

  /* ---------------------- test adjusting advisor notes ---------------------- */

  it('add new advisor note', async function () {
    const result = await testQuery(`#graphql
    mutation {
  addAdvisorNote(advisor_id: 1, advisor_note: "This is a new note") {
    advisor_id
    advisor_note
  }
}
    `)

    // confirm response object as expected
    const expectedResult = {
      data: {
        addAdvisorNote: {
          advisor_id: 1,
          advisor_note: 'This is a new note',
        },
      },
    }

    expect(result.data).to.eql(expectedResult)

    // confirm database updated as expected
    const checkDB = await prisma.advisor_notes.count({
      where: { advisor_id: 1, advisor_note: 'This is a new note' },
    })
    expect(checkDB).to.eql(1)
  })
  // advisor notes will be retrieved via the Advisor field resolver
  it('edit advisor note', async function () {
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

    // confirm database updated as expected
    const checkDB = await prisma.advisor_notes.count({
      where: {
        advisor_id: 1,
        note_id: 1,
        advisor_note: 'This is an edited note',
      },
    })
    expect(checkDB).to.eql(1)
  })
  it('remove advisor note', async function () {
    const result = await testQuery(`#graphql
    mutation {
  removeAdvisorNote(note_id: 1) {
    advisor_id
    note_id
    advisor_note
  }
}
    `)

    // confirm response object as expected
    const expectedResult = {
      data: {
        removeAdvisorNote: {
          advisor_id: 1,
          note_id: 1,
          advisor_note: 'Can travel to EMEA occasionally with 3+ months notice',
        },
      },
    }

    expect(result.data).to.eql(expectedResult)

    // confirm database updated as expected
    const checkDB = await prisma.advisor_notes.count({ where: { note_id: 1 } })
    expect(checkDB).to.eql(0)
  })
})
