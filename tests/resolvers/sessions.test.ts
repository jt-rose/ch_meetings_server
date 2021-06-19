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

  /* -------------------------- manage session notes -------------------------- */
  it('create session note')
  it('retrieve session notes via field resolver')
  it('edit session note')
  it('remove session note')

  /* ---------------------- manage requested start times ---------------------- */
  it('add requested start time')
  it('reject if invalid time range')
  it('retrieve requested start times via field resolver')
  it('edit requested start time')
  it('remove requested start time')
})
