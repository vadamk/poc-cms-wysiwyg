import ApolloClient, { InMemoryCache } from 'apollo-boost';
import { notification } from 'antd';
import { toIdValue } from 'apollo-utilities';

import { typeDefs, resolvers, GET_AUTHORIZED } from './resolvers';

import { env, localStorageKeys } from 'core/global';
import { getFromLocalStorage, removeFromLocalStorage } from 'core/services/browser';

const createHeaders = (token?: string) => {
  const headers: any = {};

  if (token) {
    headers.Authorization = token ? `Bearer ${token}` : '';
  }

  return headers;
};

const uri = `${env.apiUrl}${process.env.REACT_APP_API_PATH}`;

const cache = new InMemoryCache({
  cacheRedirects: {
    Query: {
      getArticle: (_, args) =>
        toIdValue(
          cache.config.dataIdFromObject({ __typename: 'Article', id: args.articleId }),
        ),
    },
  },
});

const storedToken = getFromLocalStorage(localStorageKeys.token);

cache.writeData({
  data: {
    isAuthorized: Boolean(storedToken),
  },
});

export const createClient = () => {
  return new ApolloClient({
    uri,
    headers: createHeaders(storedToken),
    cache,
    resolvers,
    typeDefs,
    request: async operation => {
      const token = await getFromLocalStorage(localStorageKeys.token);
      operation.setContext({
        headers: createHeaders(token),
      });
    },
    onError: ({ graphQLErrors, networkError }) => {
      const unauthorizedError = graphQLErrors?.some(({ extensions }) => {
        return extensions?.exception?.status === 401;
      });

      const videoNotFoundError = networkError && networkError['statusCode'] === 400;

      if (unauthorizedError) {
        cache.writeQuery({
          query: GET_AUTHORIZED,
          data: { isAuthorized: false },
        });

        removeFromLocalStorage(localStorageKeys.token);
      }

      if (videoNotFoundError) {
        window.location.replace('/video-not-found');
      }

      graphQLErrors?.forEach(error => {
        notification.error({
          message: error.extensions?.code,
          description: error.message,
        });
      });
    },
  });
};

export default createClient();
