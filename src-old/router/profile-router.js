'use strict';

import Router  from 'express';
import jsonParser  from 'body-parser' ;
import createError from 'http-errors' ;
import debug  from('debug')('Narcan:profile-router');

import Profile  from '../model/profile.js';
import bearerAuth  from '../lib/bearer-auth-middleware.js';

export default new Router()

profileRouter.post('/api/profile', bearerAuth, jsonParser, function(request, response, next) {
  debug('POST: /api/profile');

  if (Object.keys(request.body).length === 0) return next(createError(400, 'Bad Request'));

  request.body.userID = request.user._id;

  Profile.create(request.body)
  .then(profile => {
    response.status(201);
    response.send(profile);
  })
  .catch(next);
});

profileRouter.get('/api/profile', bearerAuth, function(request, response, next) {
  debug('GET: api/profile');

  Profile.findOne({ userID: request.user._id })
  .then(profile => {
    if (!profile) return next(createError(404, 'Profile Not Found'));
    response.send(profile);
  })
  .catch(error => next(createError(404, error.message)));
});

profileRouter.put('/api/profile', bearerAuth, jsonParser, function(request, response, next) {
  debug('PUT: api/profile');

  if (Object.keys(request.body).length === 0) return next(createError(400, 'Bad Request'));

  Profile.findOne({ userID: request.user._id })
  .then(profile => {
    for (let key in request.body) {
      profile[key] = request.body[key];
    }
    return profile.save();
  })
  .then(profile => response.json(profile))
  .catch(error => next(createError(404, error.message)));
});

profileRouter.delete('/api/profile', bearerAuth, function(request, response, next) {
  debug('DELETE: /api/profile');

  Profile.findOne({ userID: request.user._id })
  .then(profile => {
    return profile.remove();
  })
  .then(() => response.sendStatus(204))
  .catch(err => next(createError(404, err.message)));
});
