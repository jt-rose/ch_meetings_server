import { describe } from 'mocha'
import { expect } from 'chai'
import { testQuery } from '../queryTester'
import { seed } from '../../prisma/seed'
import { clear } from '../../prisma/clear'
//import { prisma } from '../../src/prisma'

describe('License Resolvers', async function () {
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

  /* -------------------- test adjusting client licenses -------------------- */
  it('add licenses to client', async function () {
    const result = await testQuery(`#graphql
    mutation {
  editLicenseAmount(licenseInput: {client_id: 1, course_id: 1, remaining_amount: 200, change_note: "test adding new license", workshop_id: 1}) {
    license_id
    client_id
    remaining_amount
    license_changes {
      change_note
    }
  }
}
    `)

    const expectedResult = {
      data: {
        editLicenseAmount: {
          license_id: 11,
          client_id: 1,
          remaining_amount: 200,
          license_changes: [
            {
              change_note: 'test adding new license',
            },
          ],
        },
      },
    }

    expect(result.data).to.eql(expectedResult)
  })
  it('update licenses for client', async function () {
    const result = await testQuery(`#graphql
    mutation {
  editLicenseAmount(licenseInput: {license_id: 1, client_id: 1, course_id: 1, remaining_amount: 200, change_note: "test updating license", workshop_id: 1}) {
    license_id
    client_id
    remaining_amount
    license_changes {
      change_note
    }
  }
}
    `)

    const expectedResult = {
      data: {
        editLicenseAmount: {
          license_id: 1,
          client_id: 1,
          remaining_amount: 200,
          license_changes: [
            {
              change_note: 'added to program',
            },
            {
              change_note: 'Completed workshop: Workshop-ID 1',
            },
            {
              change_note: 'test adding new license',
            },
          ],
        },
      },
    }

    expect(result.data).to.eql(expectedResult)
  })
  it('reject editing license when license not found', async function () {
    const result = await testQuery(`#graphql
    mutation {
  editLicenseAmount(licenseInput: {license_id: 100, client_id: 1, course_id: 1, remaining_amount: 200, change_note: "test adding new license", workshop_id: 1}) {
    license_id
    client_id
    remaining_amount
    license_changes {
      change_note
    }
  }
}
    `)

    const expectedErrorMessage = 'no such license found!'

    expect(result.data).to.be.null
    expect(result.data.errors[0].message).to.eql(expectedErrorMessage)
  })
  it('retrieve client license information', async function () {
    const result = await testQuery(`#graphql
    query {
  getClient( client_id: 1) {
    client_id
    licenses {
      license_id
      client_id
      course_id
      remaining_amount
    }
  }
}
    `)

    const expectedResult = {
      data: {
        getClient: {
          client_id: 1,
          licenses: [
            {
              license_id: 1,
              client_id: 1,
              course_id: 1,
              remaining_amount: 193,
            },
            {
              license_id: 2,
              client_id: 1,
              course_id: 3,
              remaining_amount: 35,
            },
          ],
        },
      },
    }

    expect(result.data).to.eql(expectedResult)
  })
  /* ---------------------- test license field resolvers ---------------------- */
  it('retreive field resolvers on license object', async function () {
    const result = await testQuery(`#graphql
    query {
  getClient( client_id: 1) {
    client_id
    licenses {
      license_id
      license_changes {
        license_change_id
        amount_change
        updated_amount
        change_note
      }
      client_id
      client {
        client_name
      }
    }
  }
}
    `)

    const expectedResult = {
      data: {
        getClient: {
          client_id: 1,
          licenses: [
            {
              license_id: 1,
              license_changes: [
                {
                  license_change_id: 1,
                  amount_change: 220,
                  updated_amount: 220,
                  change_note: 'added to program',
                },
                {
                  license_change_id: 2,
                  amount_change: -23,
                  updated_amount: 193,
                  change_note: 'Completed workshop: Workshop-ID 1',
                },
              ],
              client_id: 1,
              client: {
                client_name: 'Acme Corp',
              },
            },
            {
              license_id: 2,
              license_changes: [
                {
                  license_change_id: 3,
                  amount_change: 35,
                  updated_amount: 35,
                  change_note: 'added to program',
                },
              ],
              client_id: 1,
              client: {
                client_name: 'Acme Corp',
              },
            },
          ],
        },
      },
    }

    expect(result.data).to.eql(expectedResult)
  })
})
