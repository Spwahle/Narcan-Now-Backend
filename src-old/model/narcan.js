'use strict';

const mongoose = require('mongoose');
const debug = require('debug');
const createError = require('http-errors');
const Schema = mongoose.Schema;
const Location = require('./location.js');

const narcanSchema = Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  coordinates: { type: Array, required: true },
});

const Narcan = module.exports = mongoose.model('narcan', narcanSchema);

Narcan.findByIdAndAddLoc = function(id, location) {
  debug('findByIdAndAddLoc');

  return Narcan.findById(id)
  .catch(error => Promise.reject(createError(404, error.message)))
  .then( narcan => {
    location.narcanID = narcan._id;
    this.tempNarcan = location;
    return new Location (location).save();
  })
  .then( location => {
    this.tempNarcan.location.push(location._id);
    this.tempLocation = location;
    return this.tempNarcan.save();
  })
  .then( () => {
    return this.tempLocation;
  });
};
