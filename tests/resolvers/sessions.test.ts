import { describe } from 'mocha'
//import { createMockApolloUser, MockApolloTestRunners } from '../mockApollo'

describe('Session Resolvers', function () {
  /* ------------------- declare mockUser and initialize it ------------------- */
  //let mockUser: MockApolloTestRunners

  /*
  before(async function () {
    mockUser = await createMockApolloUser()
  })*/

  /* -------------------------------- run tests ------------------------------- */

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
