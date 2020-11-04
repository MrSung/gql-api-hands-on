const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Movie {
    title: String
    releaseDate: String
    rating: Int
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