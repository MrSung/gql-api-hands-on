const { ApolloServer, gql } = require('apollo-server');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const typeDefs = gql`
  scalar Date

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
    releaseDate: Date
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
    releaseDate: new Date('3-9-1989'),
    rating: 5,
  },
  {
    id: `movie-2`,
    title: '36 Chamber',
    releaseDate: new Date('10-10-1983'),
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
  Date: new GraphQLScalarType({
    name: 'Date',
    description: "it's a date, deal with it.",
    parseValue(value) {
      // value from the client
      return new Date(value);
    },
    serialize(value) {
      // value sent to the client
      return value.getTime();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value);
      }
      return null;
    },
  }),
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server started at ${url}`);
});
