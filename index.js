const { ApolloServer, gql } = require('apollo-server');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const CONSOLE_FLAG = false;

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

  input ActorInput {
    id: ID
  }

  input MovieInput {
    id: ID
    title: String
    releaseDate: Date
    rating: Int
    status: Status
    actor: [ActorInput] # Subfield should end with Input
  }

  type Mutation {
    addMovie(movie: MovieInput): [Movie]
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
    addMovie: (obj, { movie }, { userId }) => {
      if (CONSOLE_FLAG) {
        console.group('Mutation addMovie arguments');
        console.log(obj);
        // console.log(arg);
        // console.log(ctx);
        // console.log(info);
        console.groupEnd();
      }
      // Return new data if userId is authenticated
      if (userId) {
        // Do mutation and of database stuff
        const newMoviesList = [
          ...movies,
          // new movie data
          movie,
        ];
        return newMoviesList;
      }
      return movies;
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

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: ({ req }) => {
    if (CONSOLE_FLAG) {
      console.log('req', req);
    }
    // e.g. user authentication, db connections, ...
    const fakeUser = {
      userId: 'HelloImUser',
    };
    return {
      ...fakeUser,
    };
  },
});

server.listen().then(({ url }) => {
  console.log(`Server started at ${url}`);
});
