import { describe } from 'mocha'
import { prisma } from '../../src/prisma'
import {
  createMockApolloUser,
  createMockApolloAdmin,
  MockApolloTestRunners,
} from '../mockApollo'

describe('Manager Resolvers', function () {
  /* ------------------- declare mockUser and initialize it ------------------- */
  let mockUser: MockApolloTestRunners
  let mockAdmin: MockApolloTestRunners

  before(async function () {
    mockUser = await createMockApolloUser()
    mockAdmin = await createMockApolloAdmin()
  })

  /* -------------------------------- run tests ------------------------------- */

  /* --------------------------- create new manager --------------------------- */

  it('add new manager', async function () {
    await mockAdmin.confirmResponse({
      gqlScript: `
    mutation {
      addManager(managerInput: {first_name: "Darth", last_name: "Vader", email: "sith@company.net", user_type: ADMIN, email_password: "HateSand66!@"}) {
        email
      }
    }
    `,
      expectedResult: {
        addManager: {
          email: 'sith@company.net',
        },
      },
    })
  })
  it('reject adding new manager when email already in use', async function () {
    await mockAdmin.confirmError({
      gqlScript: `
    mutation {
      addManager(managerInput: {first_name: "Darth", last_name: "Vader", email: "amy.firenzi@company.net", user_type: ADMIN, email_password: "HateSand66!@"}) {
        email
      }
    }
    `,
      expectedErrorMessage: `user with email "amy.firenzi@company.net" already registered in the system`,
    })
  })

  it('reject adding new manager when role is not "admin"', async function () {
    await mockUser.confirmError({
      gqlScript: `
    mutation {
      addManager(managerInput: {first_name: "Darth", last_name: "Vader", email: "sith@company.net", user_type: ADMIN, email_password: "HateSand66!@"}) {
        email
      }
    }
    `,
      expectedErrorMessage:
        "Access denied! You don't have permission for this action!",
    })
  })
  it('reject adding manager without valid company email', async function () {
    await mockAdmin.confirmError({
      gqlScript: `
    mutation {
      addManager(managerInput: {first_name: "Darth", last_name: "Vader", email: "sith@empire.gov", user_type: ADMIN, email_password: "HateSand66!@"}) {
        email
      }
    }
    `,
      expectedErrorMessage:
        'invalid email submitted - Please confirm the email signature matches the official company email',
    })
  })
  it('reject adding manager with password that fails password strength criteria', async function () {
    await mockAdmin.confirmError({
      gqlScript: `
    mutation {
      addManager(managerInput: {first_name: "Darth", last_name: "Vader", email: "sith@company.net", user_type: ADMIN, email_password: "secret"}) {
        email
      }
    }
    `,
      expectedErrorMessage:
        'invalid password - please confirm password is at least 8 characters long, has upper and lowwercase characters, and includes a number and special character',
    })
  })

  /* ---------------------------- retrieve manager ---------------------------- */

  it('retrieve all managers', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
    query {
      getAllManagers {
        manager_id
        active
        email
      }
    }
    `,
      expectedResult: {
        getAllManagers: [
          {
            manager_id: 1,
            active: true,
            email: 'amy.firenzi@company.net',
          },
          {
            manager_id: 2,
            active: true,
            email: 'frank.low@company.net',
          },
          {
            manager_id: 3,
            active: true,
            email: 'gina.haskell@company.net',
          },
          {
            manager_id: 4,
            active: true,
            email: 'ezra.metz@company.net',
          },
          {
            manager_id: 5,
            active: true,
            email: 'luna.renzi@company.net',
          },
        ],
      },
    })
  })
  it('retrieve all managers based on workshop_id filter')
  it('retrieve workshops and clients via manager field resolvers', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
    query {
      getAllManagers {
        manager_id
        email
        workshops {
          workshop_id
        }
        clients {
          client_id
        }
      }
    }
    `,
      expectedResult: {
        getAllManagers: [
          {
            manager_id: 1,
            email: 'amy.firenzi@company.net',
            workshops: [
              {
                workshop_id: 1,
              },
              {
                workshop_id: 2,
              },
              {
                workshop_id: 3,
              },
              {
                workshop_id: 4,
              },
              {
                workshop_id: 6,
              },
              {
                workshop_id: 7,
              },
            ],
            clients: [
              {
                client_id: 1,
              },
              {
                client_id: 3,
              },
              {
                client_id: 5,
              },
            ],
          },
          {
            manager_id: 2,
            email: 'frank.low@company.net',
            workshops: [
              {
                workshop_id: 1,
              },
              {
                workshop_id: 2,
              },
              {
                workshop_id: 3,
              },
              {
                workshop_id: 5,
              },
              {
                workshop_id: 6,
              },
            ],
            clients: [
              {
                client_id: 1,
              },
              {
                client_id: 4,
              },
              {
                client_id: 5,
              },
            ],
          },
          {
            manager_id: 3,
            email: 'gina.haskell@company.net',
            workshops: [
              {
                workshop_id: 4,
              },
              {
                workshop_id: 5,
              },
              {
                workshop_id: 6,
              },
            ],
            clients: [
              {
                client_id: 3,
              },
              {
                client_id: 4,
              },
            ],
          },
          {
            manager_id: 4,
            email: 'ezra.metz@company.net',
            workshops: [],
            clients: [],
          },
          {
            manager_id: 5,
            email: 'luna.renzi@company.net',
            workshops: [],
            clients: [],
          },
        ],
      },
    })
  })

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
          assignment_id: 14,
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
