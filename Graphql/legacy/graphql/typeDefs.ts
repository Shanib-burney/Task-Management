export const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    ownedProjects: [Project!]!
  }


type Project {
  id: ID!
  name: String!
  status: Int!
  tasks: [Task!]!
}

type Task {
  id: ID!
  title: String!
  description: String
  status: Int!
}


type Team {
  id: ID!
  name: String!
}

  input CreateUserInput {
  name: String!
  email: String!
  password: String!
  }
  input CreateProjectInput {
  name: String!
  teamId: Int!
  ownerId: Int!
}

  input CreateTaskInput {
  title: String!
  description: String
  projectId: Int!
  assigneeId: Int
}
  input CreateTeamInput {
  name: String!
}

 type Query {
    users: [User!]!
  }
  type Mutation {
    createUser(input: CreateUserInput!): User!
    createProject(input: CreateProjectInput!): Project!
    createTask(input: CreateTaskInput!): Task!
    createTeam(input: CreateTeamInput!): Team!
  }
`;
