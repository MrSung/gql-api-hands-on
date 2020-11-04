const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  enum Status {
    WATCHED
    INTERESTED
    NOT_INTERESTED
    UNKNOWN
  }

  type Actor {
    id: ID!
    name: String!
  }

  type Movie {
    id: ID!
    title: String!
    releaseDate: String
    rating: Int
    status: Status
    actor: [Actor]
    # sample1: Float
    # sample2: Boolean
  }

  type Query {
    movies: [Movie]
    movie(id: ID): Movie
  }
`;

const movies = [
  {
    id: `movie-1`,
    title: '5 deadly venoms',
    releaseDate: '10-10-1983',
    rating: 5,
  },
  {
    id: `movie-2`,
    title: '36 Chamber',
    releaseDate: '10-10-1983',
    rating: 5,
    actor: [
      {
        id: '1',
        name: 'Gordon Liu',
      },
    ],
  },
];

const resolvers = {
  Query: {
    movies: () => movies,
    movie: (obj, { id }, ctx, info) => {
      console.group('obj');
      console.log(obj);
      console.groupEnd();
      console.group('id');
      console.log(id);
      console.groupEnd();
      console.group('ctx');
      console.log(ctx);
      console.groupEnd();
      console.group('info');
      console.log(info);
      console.groupEnd();
      return movies.find((mv) => mv.id === id);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server started at ${url}`);
});
