import { describe } from 'mocha'
//import { expect } from 'chai'
//import { testQuery } from '../queryTester'
import { seed } from '../../prisma/seed'
import { clear } from '../../prisma/clear'

describe('Manager Resolvers', async function () {
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

  /* --------------------------- create new manager --------------------------- */

  it('add new manager') // with default password
  it('reject adding new manager when email already in use')
  it('reject adding new manager when role is not "admin"')

  /* ---------------------------- retrieve manager ---------------------------- */

  it('retrieve manager')
  it('retrieve all managers')
  it('retrieve all managers based on workshop_id filter')

  /* ------------------------------ edit managers ----------------------------- */
  it('edit manager details')
  it('reject updating manager email to one already in use')
  it('reject updating when role is not "admin"')
  // allow for user to edit their own account?

  /* --------------------------------- sign in -------------------------------- */

  it('sign in with email and password')
  it('reject sign in when wrong email + password provided')
  it('sign in with cookies')
  it('reject sign in when cookies not valid')
  it('reject sign in whenc cookies expired')

  /* ----------------------------- reset password ----------------------------- */
  it('reset password')
  it('reject new password when fails to meet password strength criteria')
  it('reject resetting password when not "admin" or the user themselves')
  it('send reset link to appropriate email') // will need to figure out how to test this

  /* ----------------------------- delete manager ----------------------------- */
  it('remove manager')
  it('reject removing manager when workshops are scheduled to them')
  it('reject removing manager when role not "admin"')

  /* ----------------------- manage client relationships ---------------------- */
  it('assign client to manager')
  it('remove client from manager')
  it('change active status of client relationship')

  /* ----------------------- manage workshop assignments ---------------------- */
  it('add workshop assignment')
  it('remove workshop assignment')
})
