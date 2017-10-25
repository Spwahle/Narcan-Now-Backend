'use strict';

import express = from('express');
import cors = from('cors');
import morgan = from('morgan');
import mongoose = from('mongoose');
import dotenv = from('dotenv');
import debug = from('debug')('narcan:server');
import authRouter = from('./src/route/auth-router.js');
// import feedbackRouter = from('./route/feedback-router.js');
import errorHandler = from('./src/lib/error-handler.js');

dotenv.load();

mongoose.connect(process.env.MONGODB_URI, {
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
