const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  enum Status {
    WATCHED
    INTERESTED
    NOT_INTERESTED
    UNKNOWN
  }

  type Actor {
    id: ID
    name: String
  }

  type Movie {
    id: ID
    title: String
    releaseDate: String
    rating: Int
    status: Status
    actor: [Actor]
    # sample1: Float
    # sample2: Boolean
  }

  type Query {
    movies: [Movie]
  }
`;

const movies = [
  {
    title: '5 deadly venoms',
    releaseDate: '10-10-1983',
    rating: 5,
  },
  {
    title: '36 Chamber',
    releaseDate: '10-10-1983',
    rating: 5,
  },
];

const resolvers = {
  Query: {
    movies: () => movies,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server started at ${url}`);
});
