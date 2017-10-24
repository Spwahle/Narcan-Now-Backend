'use strict';

const mongoose =   require('mongoose');
const debug = require('debug');
const createError = require('http-errors');
const Schema = mongoose.Schema;
const Available = require('./available.js');

const locationSchema = Schema({
  locationID: { type: Schema.Types.ObjectId, required: true }
});

const Location = module.exports = mongoose.model('location', locationSchema);

Location.findByIdAndAddLocation = function(id, available) {
  debug('findByIdAndAddLocal');

  return Location.findById(id)
  .catch(error => Promise.reject(createError(404, error.message)))
  .then( location => {
    available.locationID = location._id;
    this.tempLocation = location;
    return new Available(available).save();
  })
  .then( available => {
    this.tempLocation.availables.push(available._id);
    this.tempavailable = available;
    return this.tempLocation.save();
  })
  .then( () => {
    return this.tempavailable;
  });
};
