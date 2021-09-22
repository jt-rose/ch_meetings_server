// add workshop - initial nested create
// retrieve all workshops, with pagination
// retrieve all workshops, with filters
// retrieve all workshops, filtered by user
// further updates will use specific tables
// edit workshop
// remove workshop
// restore workshop
// reject restoring workshop if not enough available licenses to reserve

// validation
// reject if same cohort name
// reject if old date ???
// reject if time conflict

// add to change log
// retrieve change log via field resolver

//add workshop note
// retrieve workshop notes via field resolver
// edit workshop note
// remove workshop note
// test status update tied to session update
import { describe } from 'mocha'
//import { prisma } from '../../src/prisma'
import { createMockApolloUser, MockApolloTestRunners } from '../mockApollo'

describe('Workshop Resolvers', function () {
  /* ------------------- declare mockUser and initialize it ------------------- */
  let mockUser: MockApolloTestRunners

  before(async function () {
    mockUser = await createMockApolloUser()
  })

  describe('retrieve workshops', function () {
    it('retrieve single workshop with related fields')
    it('return error when workshop not found')
    it('retreive array of workshops')
    it('retrieve array of workshops with filter and pagination fields')
    it('provide pagination info on additional objects')
  })

  describe('create workshop request', function () {
    it('add workshop')
    it('reject adding workshop when time confilict present')
    it('update license changes when creating workshop request')
  })

  describe('edit unprocessed request', function () {
    it('edit workshop request/ sessions when not yet in scheduling process')
    it('reject editing when status no long "REQUESTED"')
    it('reject editing when not a team member')
    it('set status to deleted and update licenses')
    it('reject editing if time conflict')
  })

  describe('update scheduling status for coordinators', function () {
    it('update scheduling status when in requested, vetting, holding status')
    it(
      'reject updating status when moved to scheduled, cancelled, or completed'
    )
    it('reject updating when not coordinator')
  })

  describe('confirm workshop complete', function () {
    it('mark workshop as complete and finalize license changes')
    it('reconcile different final class size with license reservations')
    it('reject finalizing when not in "SCHEDULED" status')
    it('reject finalizing when workshop end date not passed yet')
    it('reject finalizing when updated license amount is not sufficient')
  })
})
