import { describe } from 'mocha'
import { prisma } from '../../src/prisma'
import {
  createMockApolloUser,
  //createMockApolloAdmin,
  MockApolloTestRunners,
} from '../mockApollo'

describe('Manager Resolvers', function () {
  /* ------------------- declare mockUser and initialize it ------------------- */
  let mockUser: MockApolloTestRunners
  //let mockAdmin: MockApolloTestRunners

  before(async function () {
    mockUser = await createMockApolloUser()
    //mockAdmin = await createMockApolloAdmin()
  })

  /* -------------------------------- run tests ------------------------------- */

  /* --------------------------- create new manager --------------------------- */

  it('add new manager') // with default password
  it('reject adding new manager when email already in use')
  it('reject adding new manager when role is not "admin"')

  /* ---------------------------- retrieve manager ---------------------------- */

  it('retrieve manager')
  it('retrieve all managers')
  it('retrieve all managers based on workshop_id filter')
  it('retrieve workshops via manager field resolver')

  /* ------------------------------ edit managers ----------------------------- */
  it('edit manager details')
  it('reject updating manager email to one already in use')
  it('reject updating when role is not "admin"')
  // allow for user to edit their own account?

  /* --------------------------------- sign in -------------------------------- */

  it('sign in with email and password', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
    mutation {
  login(email: "amy.firenzi@company.net", password: "Password123!") {
    manager_id
  }
}
    `,
      expectedResult: {
        login: {
          manager_id: 1,
        },
      },
    })
  })

  it('reject sign in when wrong email provided', async function () {
    await mockUser.confirmError({
      gqlScript: `
    mutation {
  login(email: "john.doe@email.com", password: "Password123!") {
    manager_id
  }
}
    `,
      expectedErrorMessage: 'incorrect username/password',
    })
  })

  it('reject sign in when wrong password provided', async function () {
    await mockUser.confirmError({
      gqlScript: `
    mutation {
  login(email: "amy.firenzi@company.net", password: "wrongpassword") {
    manager_id
  }
}
    `,
      expectedErrorMessage: 'incorrect username/password',
    })
  })
  it('sign in with cookies')
  it('reject sign in when cookies not valid')
  it('reject sign in when cookies expired')

  /* ----------------------------- reset password ----------------------------- */
  it('reset password')
  it('reject new password when fails to meet password strength criteria')
  it('reject resetting password when not "admin" or the user themselves')
  it('send reset link to appropriate email') // will need to figure out how to test this

  /* ----------------------------- delete manager ----------------------------- */
  it('remove manager')
  it('reject removing manager when workshops are scheduled to them')
  it('reject removing manager when role not "admin"')
  it('deactivate manager')

  /* ----------------------- manage client relationships ---------------------- */
  it('assign client to manager')
  it('remove client from manager')
  it('change active status of client relationship')

  /* ----------------------- manage workshop assignments ---------------------- */
  it('add workshop assignment', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
    mutation {
  addManagerToWorkshop(manager_id: 3, workshop_id: 1) {
    manager_id
    workshop_id
  }
}
    `,
      expectedResult: {
        addManagerToWorkshop: {
          manager_id: 3,
          workshop_id: 1,
        },
      },
    })

    await mockUser.confirmDBUpdate({
      databaseQuery: prisma.manager_assignments.count({
        where: {
          manager_id: 3,
          workshop_id: 1,
        },
      }),
    })
  })

  it('return current assignment instead of creating duplicate', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
    mutation {
  addManagerToWorkshop(manager_id: 1, workshop_id: 1) {
    assignment_id
    manager_id
    workshop_id
  }
}
    `,
      expectedResult: {
        addManagerToWorkshop: {
          assignment_id: 1,
          manager_id: 1,
          workshop_id: 1,
        },
      },
    })

    await mockUser.confirmDBUpdate({
      databaseQuery: prisma.manager_assignments.count({
        where: {
          manager_id: 1,
          workshop_id: 1,
        },
      }),
    })
  })

  it('if creating duplicate of inactive assignment, switch current assignment to active', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
      mutation {
    addManagerToWorkshop(manager_id: 3, workshop_id: 6) {
      assignment_id
      manager_id
      workshop_id
      active
    }
  }
      `,
      expectedResult: {
        addManagerToWorkshop: {
          assignment_id: 13,
          manager_id: 3,
          workshop_id: 6,
          active: true,
        },
      },
    })

    await mockUser.confirmDBUpdate({
      databaseQuery: prisma.manager_assignments.count({
        where: {
          manager_id: 3,
          workshop_id: 6,
        },
      }),
    })
  })

  it('remove workshop assignment', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
    mutation {
  removeManagerFromWorkshop(assignment_id: 1) {
    assignment_id
    manager_id
    active
  }
}
    `,
      expectedResult: {
        removeManagerFromWorkshop: {
          assignment_id: 1,
          manager_id: 1,
          active: true,
        },
      },
    })

    await mockUser.confirmDBRemoval({
      databaseQuery: prisma.manager_assignments.count({
        where: {
          assignment_id: 1,
        },
      }),
    })
  })
  it('change active status of manager assignment', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
    mutation {
  changeManagerAssignmentStatus(assignment_id: 13, active: true) {
    assignment_id
    active
  }
}
    `,
      expectedResult: {
        changeManagerAssignmentStatus: {
          assignment_id: 13,
          active: true,
        },
      },
    })

    await mockUser.confirmDBUpdate({
      databaseQuery: prisma.manager_assignments.count({
        where: {
          assignment_id: 13,
          active: true,
        },
      }),
    })
  })
})
