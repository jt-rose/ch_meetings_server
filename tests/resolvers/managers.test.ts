import { describe } from 'mocha'
import { expect } from 'chai'
import { testQuery } from '../queryTester'
import { seed } from '../../prisma/seed'
import { clear } from '../../prisma/clear'
import { prisma } from '../../src/prisma'

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
  it('add workshop assignment', async function () {
    const result = await testQuery(`#graphql
    mutation {
  addManagerToWorkshop(manager_id: 3, workshop_id: 1) {
    manager_id
    workshop_id
  }
}
    `)

    const expectedResult = {
      data: {
        addManagerToWorkshop: {
          manager_id: 3,
          workshop_id: 1,
        },
      },
    }

    expect(result.data).to.eql(expectedResult)

    const checkDB = await prisma.manager_assignments.count({
      where: {
        manager_id: 3,
        workshop_id: 1,
      },
    })

    expect(checkDB).to.eql(1)
  })
  it('return current assignment instead of creating duplicate', async function () {
    const result = await testQuery(`#graphql
    mutation {
  addManagerToWorkshop(manager_id: 1, workshop_id: 1) {
    assignment_id
    manager_id
    workshop_id
  }
}
    `)

    const expectedResult = {
      data: {
        addManagerToWorkshop: {
          assignment_id: 1,
          manager_id: 1,
          workshop_id: 1,
        },
      },
    }

    expect(result.data).to.eql(expectedResult)

    const checkDB = await prisma.manager_assignments.count({
      where: {
        manager_id: 1,
        workshop_id: 1,
      },
    })

    expect(checkDB).to.eql(1)
  })
  it('if creating duplicate of inactive assignment, switch current assignment to active', async function () {
    const result = await testQuery(`#graphql
      mutation {
    addManagerToWorkshop(manager_id: 3, workshop_id: 6) {
      assignment_id
      manager_id
      workshop_id
      active
    }
  }
      `)

    const expectedResult = {
      data: {
        addManagerToWorkshop: {
          assignment_id: 13,
          manager_id: 3,
          workshop_id: 6,
          active: true,
        },
      },
    }

    expect(result.data).to.eql(expectedResult)

    const checkDB = await prisma.manager_assignments.count({
      where: {
        manager_id: 3,
        workshop_id: 6,
      },
    })

    expect(checkDB).to.eql(1)
  })
  it('remove workshop assignment', async function () {
    const result = await testQuery(`#graphql
    mutation {
  removeManagerFromWorkshop(assignment_id: 1) {
    assignment_id
    manager_id
    active
  }
}
    `)

    const expectedResult = {
      data: {
        removeManagerFromWorkshop: {
          assignment_id: 1,
          manager_id: 1,
          active: true,
        },
      },
    }

    expect(result.data).to.eql(expectedResult)

    const checkDB = await prisma.manager_assignments.count({
      where: {
        assignment_id: 1,
      },
    })

    expect(checkDB).to.eql(0)
  })
  it('change active status of manager assignment', async function () {
    const result = await testQuery(`#graphql
    mutation {
  changeManagerAssignmentStatus(assignment_id: 13, active: true) {
    assignment_id
    active
  }
}
    `)

    const expectedResult = {
      data: {
        changeManagerAssignmentStatus: {
          assignment_id: 13,
          active: true,
        },
      },
    }

    expect(result.data).to.eql(expectedResult)

    const checkDB = await prisma.manager_assignments.count({
      where: {
        assignment_id: 13,
        active: true,
      },
    })

    expect(checkDB).to.eql(1)
  })
})
