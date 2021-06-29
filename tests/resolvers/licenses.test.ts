import { describe } from 'mocha'
import { expect } from 'chai'
import { testQuery } from '../queryTester'
import { seed } from '../../prisma/seed'
import { clear } from '../../prisma/clear'
import { prisma } from '../../src/prisma'

describe('License Resolvers', async function () {
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

  /* -------------------- test adjusting client licenses -------------------- */
  it('add licenses to client')
  it('remove licenses from client')
  // no edit function - add/ remove is enough
  it('retrieve client license information')
  it('retrieve history of license amount changes')
  /* ---------------------- test license field resolvers ---------------------- */
  it('retreive field resolvers on license object')
  it('retreive field resolvers on license change object')
})
