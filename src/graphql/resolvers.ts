import { gql, Resolvers, ApolloClient } from 'apollo-boost';
import { ApolloCache } from 'apollo-cache';

export const typeDefs = gql`

  extend type Query {
    isAuthorized: Boolean!
  }

  extend type Mutation {
    setAuthorized(isAuthorized: Boolean!): Boolean!
  }
`;

export const GET_AUTHORIZED = gql`
  query {
    isAuthorized @client
  }
`;

type ResolverFn = (
  parent: any,
  args: any,
  context: {
    cache: ApolloCache<any>;
    client: ApolloClient<any>;
  },
) => any;

interface ResolverMap {
  [field: string]: ResolverFn;
}

interface AppResolvers extends Resolvers {
  Mutation: ResolverMap;
  Query: ResolverMap;
}

export const resolvers: AppResolvers = {
  Mutation: {
    setAuthorized: (_, { isAuthorized }, { cache }): boolean => {
      cache.writeQuery({
        query: GET_AUTHORIZED,
        data: { isAuthorized },
      });

      return isAuthorized;
    },
  },
  Query: {},
};
