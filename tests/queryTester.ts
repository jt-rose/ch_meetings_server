import axios from 'axios'
import { expect } from 'chai'
import { PrismaPromise } from '@prisma/client'
import { ApolloServer } from 'apollo-server-express'

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

// run a graphql query against apollo, confirming valid response
export const confirmResponse =
  (apollo: ApolloServer) =>
  async (config: { gqlScript: string; expectedResult: any }) => {
    const response = await apollo.executeOperation({ query: config.gqlScript })
    // confirm valid gql response
    expect(response.data).to.eql(config.expectedResult)
  }

// run a graphql query against apollo, confirming expected error
export const confirmError =
  (apollo: ApolloServer) =>
  async (config: { gqlScript: string; expectedErrorMessage: string }) => {
    const response = await apollo.executeOperation({ query: config.gqlScript })
    // confirm valid gql response
    expect(response.data).to.eql(null)
    expect(response.errors[0]?.message).to.eql(config.expectedErrorMessage)
  }

// check database to confirm update succeeded
export const confirmDBUpdate = async (config: {
  databaseQuery: PrismaPromise<number>
  expectedCount: number
}) => {
  // confirm database updated as expected
  const checkDB = await config.databaseQuery // ex: prisma.advisor_notes.count({ where: { note_id: 1 } })
  expect(checkDB).to.eql(config.expectedCount)
}
