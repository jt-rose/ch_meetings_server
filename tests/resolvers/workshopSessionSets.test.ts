import { describe } from 'mocha'
//import { expect } from 'chai'
//import { testQuery } from '../queryTester'
import { seed } from '../../prisma/seed'
import { clear } from '../../prisma/clear'
//import { prisma } from '../../src/prisma'

describe('Workshop Session Sets Resolvers', function () {
  /* --------------------- seed and clear DB for each test -------------------- */

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

  it('add workshop session set')
  it('retreive workshop session set via field resolver')
  it('edit workshop session set')
  it('remove workshop session set')
  it('remove workshop session set when course is removed')
})
