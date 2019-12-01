import { matchPath } from 'react-router-dom';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';

import { logger, accessLogger } from './middleware/logger';
import renderer from './middleware/renderer';
import storeHandler from './middleware/storeHandler';
import errorHandler from './middleware/errorHandler';
import routes from '../client/routes';

// use docker ENV for production
if (process.env.NODE_ENV !== 'production')
    dotenv.config({ path: '.env.local' });

const STATIC = process.env.NODE_ENV === 'production' ? 'build' : 'dev';

// should process.exit(1) & restart process
process.on('uncaughtException', ex => logger.error(ex.message, ex));
process.on('unhandledRejection', ex => logger.error(ex.message, ex));

/* eslint-disable import/prefer-default-export */
export const app = express();

// gzip middleware
app.get('*.js.gz', (req, res, next) => {
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'text/javascript');
    next();
});

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(STATIC));
app.use(express.static('./public')); // extra assets

// renderer
app.get('*', (req, res, next) => {
    const activeRoute = routes.find(route => matchPath(req.url, route)) || {};
    const beforeRender = activeRoute.preFetch
        ? activeRoute.preFetch()
        : Promise.resolve();

    beforeRender
        .then(data => renderer(storeHandler(data, req))(req, res, next))
        .catch(next);
});

if (process.env.NODE_ENV === 'production') {
    // handle server error
    app.use(errorHandler);
    // accessLogger
    app.use(accessLogger);
}
