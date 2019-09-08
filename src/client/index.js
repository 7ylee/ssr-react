/* eslint-disable no-underscore-dangle */
/* eslint-disable global-require */

// polyfills
import 'core-js/features/set';
import 'core-js/features/promise';
import 'core-js/es/map';

import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';

import React from 'react';
import thunk from 'redux-thunk';

import App from './App';
import rootReducer from './reducers/rootReducer';

import './favicon.ico';

OfflinePluginRuntime.install();

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__;

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__;

let middleware;
// remove redux-devtool in production
if (process.env.NODE_ENV === 'production') {
    middleware = applyMiddleware(thunk);
} else {
    middleware = require('redux-devtools-extension').composeWithDevTools(
        applyMiddleware(thunk)
    );
}

// Create Redux store with initial state
const store = createStore(rootReducer, preloadedState, middleware);

hydrate(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('app')
);

if (process.env.NODE_ENV === 'development') {
    require('webpack-hot-middleware/client');
    if (module.hot) module.hot.accept();
}
