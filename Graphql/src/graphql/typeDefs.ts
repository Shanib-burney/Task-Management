export const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
  }
  input CreateUserInput {
  name: String!
  email: String!
  passwordHash: String!
}

  type Query {
    users: [User!]!
  }
  type Mutation {
    createUser(input: CreateUserInput!): User!
  }
`;