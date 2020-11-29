const { ApolloServer, gql } = require('apollo-server');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const CONSOLE_FLAG = true;

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

  type Mutation {
    addMovie(title: String, releaseDate: Date, id: ID): [Movie]
  }
`;

const actors = [
  {
    id: 'gordon',
    name: 'Gordon Liu',
  },
  {
    id: 'jackie',
    name: 'Jackie Chan',
  },
];

const movies = [
  {
    id: `movie-1`,
    title: '5 deadly venoms',
    releaseDate: new Date('3-9-1989'),
    rating: 5,
    actor: [
      {
        id: '1',
        name: 'Jackie Chen',
      },
    ],
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
      if (CONSOLE_FLAG) {
        console.group('Query movie arguments');
        console.log(obj);
        console.log(id);
        console.log(ctx);
        console.log(info);
        console.groupEnd();
      }
      return movies.find((mv) => mv.id === id);
    },
  },

  Movie: {
    actor: ({ actor }, arg, ctx, info) => {
      if (CONSOLE_FLAG) {
        console.group('Movie actor arguments');
        console.log(actor);
        console.log(arg);
        console.log(ctx);
        console.log(info);
        console.groupEnd();
      }
      const actorIds = actor.map(({ id }) => id);
      const filteredActors = actors.filter(({ id }) => actorIds.includes(id));
      return filteredActors;
    },
  },

  Mutation: {
    addMovie: (obj, { id, title, releaseDate }, ctx, info) => {
      if (CONSOLE_FLAG) {
        console.group('Mutation addMovie arguments');
        console.log(obj);
        console.log(id);
        console.log(title);
        console.log(releaseDate);
        console.log(ctx);
        console.log(info);
        console.groupEnd();
      }
      // Do mutation end of database stuff
      const newMoviesList = [
        ...movies,
        // new movie data
        {
          id,
          title,
          releaseDate,
        },
      ];
      // Return data as expected in schema
      return newMoviesList;
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
