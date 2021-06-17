import { describe } from 'mocha'
//import { expect } from 'chai'
//import { testQuery } from '../queryTester'
import { seed } from '../../prisma/seed'
import { clear } from '../../prisma/clear'
//import { prisma } from '../../src/prisma'

describe('Course Resolvers', function () {
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
  /* ----------------------- test courses field resolver ---------------------- */
  it('access related coursework through field resolver')

  /* -------------------------- test coursework CRUD -------------------------- */
  it('create courswork')
  it(' retrieve all coursework')
  it('edit coursework')
  it('remove coursework')

  /* -------------- manage many-to-many relationship with courses ------------- */
  it('register coursework as material for course')
  it('remove coursework from course materials')
})
