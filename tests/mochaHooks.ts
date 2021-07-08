import { seed } from '../prisma/seed'
import { clear } from '../prisma/clear'
//import { createMockApolloUser, createMockApolloAdmin } from './mockApollo'

export const mochaHooks = async () => {
  //const mockUser = await createMockApolloUser()
  //const mockAdmin = await createMockApolloAdmin()
  return {
    //mockUser,
    //mockAdmin,
    //before: async function () {
    //await clear()
    /*
    this.mockUser = mockUser
    this.mockAdmin = mockAdmin
    this.confirmDBUpdate = mockUser.confirmDBUpdate
    this.confirmDBRemoval = mockUser.confirmDBRemoval
    */
    //},
    // reset database before each test
    beforeEach: async function () {
      await clear()
      await seed()
    },
    // reset database with mock data for local testing after unit tests complete
    after: async function () {
      await clear()
      await seed()
    },
  }
}
