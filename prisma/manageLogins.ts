import { testQuery } from '../tests/queryTester'

export const loginAsManager = testQuery(`#graphql
    mutation {
  login(email: "frank.low@company.net", password: "My@Password789") {
    manager_id
  }
}
`)

export const loginAsAdmin = testQuery(`#graphql
mutation {
login(email: "amy.firenzi@company.net", password: "Password123!") {
manager_id
}
}
`)

export const logout = testQuery(`#graphql
    mutation {
  logout
}
`)
