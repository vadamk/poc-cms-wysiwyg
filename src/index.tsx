import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import * as Sentry from '@sentry/react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import 'styles/index.scss';

import client from 'core/graphql/client';
import * as serviceWorker from 'serviceWorker';
import Routes from 'routes';

if (process.env.NODE_ENV !== 'production') {
  Sentry.init({
    dsn: 'https://7625f917ab8d4304aa9cd4c613270894@o420297.ingest.sentry.io/5338316',
  });
}

ReactDOM.render(
  <ApolloProvider client={client}>
    <DndProvider backend={HTML5Backend}>
      <Routes />
    </DndProvider>
  </ApolloProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
