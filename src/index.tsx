import React from 'react';
import ReactDOM from 'react-dom';
import hljs from 'highlight.js/lib/core';
import html from 'highlight.js/lib/languages/xml';
import 'highlight.js/styles/github.css';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

hljs.registerLanguage('html', html);
hljs.initHighlightingOnLoad();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
