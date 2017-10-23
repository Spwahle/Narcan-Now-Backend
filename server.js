'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const debug = require('debug')('narcan:server');
const authRouter = require('./src/route/auth-router.js');
// const feedbackRouter = require('./route/feedback-router.js');
const errorHandler = require('./src/lib/error-handler.js');

dotenv.load();

mongoose.connect(process.env.MONGOD_URI, {
  useMongoClient: true
});

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGINS,
  credentials: true,
}));
app.use(morgan('dev'));
app.use(authRouter);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  debug(`listening on: ${process.env.PORT}`);
});
