import axios from 'axios'
import { expect } from 'chai'
import { PrismaPromise } from '@prisma/client'
import { ApolloServer } from 'apollo-server-express'

/* ------------------------ test against live server ------------------------ */

const API_URL = `http://localhost:5000/graphql`

// run a graphql query against the testing environment
export const testQuery = async (graphqlRequest: string, variables?: any) =>
  await axios.post(
    API_URL,
    {
      query: graphqlRequest,
      variables,
    },
    {
      withCredentials: true,
    }
  )

/* ---------------- test valid query against apollo instance ---------------- */

export type ConfirmResponse = (config: {
  gqlScript: string
  expectedResult: any
}) => Promise<void>

export const confirmResponse =
  (apollo: ApolloServer) =>
  async (config: { gqlScript: string; expectedResult: any }) => {
    const response = await apollo.executeOperation({ query: config.gqlScript })
    // confirm valid gql response
    expect(response.data).to.eql(config.expectedResult)
  }

/* --------------- test error response against apollo instance -------------- */

export type ConfirmError = (config: {
  gqlScript: string
  expectedErrorMessage: string
}) => Promise<void>

export const confirmError =
  (apollo: ApolloServer) =>
  async (config: { gqlScript: string; expectedErrorMessage: string }) => {
    const response = await apollo.executeOperation({ query: config.gqlScript })
    // confirm valid gql response
    expect(response.data).to.eql(null)
    expect(response.errors[0]?.message).to.eql(config.expectedErrorMessage)
  }

/* ------------------- check database for expected update ------------------- */

export const confirmDBUpdate = async (config: {
  databaseQuery: PrismaPromise<number>
  expectedCount: number
}) => {
  // confirm database updated as expected
  const checkDB = await config.databaseQuery // ex: prisma.advisor_notes.count({ where: { note_id: 1 } })
  expect(checkDB).to.eql(config.expectedCount)
}
