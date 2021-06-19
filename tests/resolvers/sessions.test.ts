import { describe } from 'mocha'
//import { expect } from 'chai'
//import { testQuery } from '../queryTester'
import { seed } from '../../prisma/seed'
import { clear } from '../../prisma/clear'

describe('Session Resolvers', async function () {
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

  /* ----------------------------- add new session ---------------------------- */
  it('create new session')
  it('reject creating new session if time conflict')
  // no read needed - field resolver on workshops

  /* ------------------------------ edit session ------------------------------ */
  it('edit session')
  it('reject edit if time conflict')

  /* ----------------------------- remove session ----------------------------- */
  it('remove session')
  it('reject removing session if status already completed')
})
