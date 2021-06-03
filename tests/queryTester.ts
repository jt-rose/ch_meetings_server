import axios from 'axios'

const API_URL = `http://localhost:5000/graphql`

// run a graphql query against the testing environment
export const testQuery = async (graphqlRequest: string, variables?: any) =>
  await axios.post(API_URL, {
    query: graphqlRequest,
    variables,
  })
