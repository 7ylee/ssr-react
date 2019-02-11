import { createStore } from 'redux';
import { matchPath } from 'react-router-dom';
import cors from 'cors';
import express from 'express';

import serverRenderer from './middleware/serverRenderer';
import rootReducer from '../shared/rootReducer';
import routes from '../shared/routes';

const PORT = process.env.NODE_ENV === 'production' ? 8080 : 3000;
const STATIC = process.env.NODE_ENV === 'production' ? 'dist' : 'dev';

const app = express();

/* eslint-disable global-require */
if (process.env.NODE_ENV === 'development') {
    const webpack = require('webpack');
    const config = require('../../webpack.config');
    const compiler = webpack(config[0]);

    app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: config[0].output.publicPath,
        stats: {
            assets: false,
            colors: true,
            version: false,
            hash: false,
            timings: false,
            chunks: false,
            chunkModules: false
        }
    }));
    app.use(require('webpack-hot-middleware')(compiler));
}

app.use(cors());
app.use(express.static(STATIC));

app.get('*', (req, res, next) => {
    const activeRoute = routes.find((route) => matchPath(req.url, route)) || {};
    const store = createStore(rootReducer);
    const promise = activeRoute.fetchInitialData
        ? activeRoute.fetchInitialData(req.path)
        : Promise.resolve();

    promise
        .then(data => serverRenderer(store, data)(req, res))
        .catch(next);
});

/* eslint-disable no-console */
app.listen(PORT, () => console.log(`listening on ${PORT} NODE_ENV="${process.env.NODE_ENV}"`));