import { describe } from 'mocha'
//import { prisma } from '../../src/prisma'
import { createMockApolloUser, MockApolloTestRunners } from '../mockApollo'

describe('Workshop Change Request Resolvers', function () {
  /* ------------------- declare mockUser and initialize it ------------------- */
  let mockUser: MockApolloTestRunners

  before(async function () {
    mockUser = await createMockApolloUser()
  })
  describe('upsert change request', function () {
    it('field resolvers on workshop sessions and managers')
    it('create change request')
    it('edit change request')
    it('reject upserting change request if not team member / coordinator')
    it('reject if time conflict found')
    it('reject if insufficient licenses for updated class size')
  })
  describe('approve change request', function () {
    it('approve change request and update workshop, sessions, and licenses')
    it('reject if coordinator approving coordinator request')
    it('reject if manager approving manager request')
    it('reject if time conflict found')
    it('reject if insufficient licenses to approve request')
  })
  describe('reject change request', function () {
    it('remove change request and associated sessions')
    it('invalidate attempt to reject if not team member')
  })
})
