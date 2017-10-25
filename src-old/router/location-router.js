'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('parkify:available-router');
const jsonParser = require('body-parser').json();

const Location = require('../model/location.js');
const Available = require('../model/available.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const availableRouter = module.exports = new Router();

availableRouter.post('/api/lot/:lotID/location/:locationID/available', bearerAuth, jsonParser, function(request, response, next) {
  debug('POST: /api/lot/:lotID/location/:locationID/available');

  Location.findByIdAndAddavailable(request.params.locationID, request.body)
  .then(available => response.json(available))
  .catch(next);
});

availableRouter.get('/api/lot/:lotID/location/:locationID/available/:id', bearerAuth, function(request, response, next) {
  debug('GET: /api/lot/:lotID/location/:locationID/available/:id');

  Available.findById(request.params.id)
  .then(available => {
    if(!available) return next(createError(404, 'available not found'));
    response.json(available);
  })
  .catch(err => next(createError(404, err.message)));
});

availableRouter.put('/api/lot/:lotID/location/:locationID/available/:id', bearerAuth, jsonParser, function(request, response, next) {
  debug('PUT: /api/lot/:lotID/location/:locationID/available/:id');

  if (Object.keys(request.body).length === 0) return next(createError(400, 'Bad Request'));

  Available.findByIdAndUpdate(request.params.id, request.body, { 'new': true })
  .then(location => response.json(location))
  .catch(err => {
    if(err.name !== 'ValidationError') {
      err = createError(404, err.message);
    }
    next(err);
  });
});

availableRouter.delete('/api/lot/:lotID/location/:locationID/available/:id', bearerAuth, function(request, response, next) {
  debug('DELETE: /api/lot/:lotID/location/:locationID/available/:id');

  Available.findByIdAndRemove(request.params.id)
  .then(() => response.sendStatus(204))
  .catch(err => next(createError(404, err.message)));
});
