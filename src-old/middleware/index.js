'use strict';

import cors from 'cors';
import morgan from 'morgan';
import {Router} from 'express';
import cookieParser from 'cookie-parser';
import routerAuth from './router-auth.js';
import routeErrorHandler from './route-error-handler.js';
import routerPost from './router-post.js';
import errorHandler from './error-handler.js';
import bindResponseMethods from './bind-response-methods.js';

export default new Router()
  .use([
    cors({
      origin: process.env.CORS_ORIGINS.split(' '),
      credentials: true,
    }),
    morgan('dev'),
    cookieParser(),
    bindResponseMethods,
    routerAuth,
    routerPost,
    routeErrorHandler,
    errorHandler,
  ]);
