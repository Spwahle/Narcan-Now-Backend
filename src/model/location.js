'use strict';

const mongoose =   require('mongoose');
const debug = require('debug');
const createError = require('http-errors');
const Schema = mongoose.Schema;
const Timeslot = require('./timeslot.js');

const locationSchema = Schema({
  locationID: { type: Schema.Types.ObjectId, required: true }
});

const Spot = module.exports = mongoose.model('location', locationSchema);

Spot.findByIdAndAddLocation = function(id, timeslot) {
  debug('findByIdAndAddLoca');

  return Spot.findById(id)
  .catch(error => Promise.reject(createError(404, error.message)))
  .then( location => {
    timeslot.locationID = location._id;
    this.tempLocation = location;
    return new Timeslot(timeslot).save();
  })
  .then( timeslot => {
    this.tempLocation.timeslots.push(timeslot._id);
    this.tempTimeslot = timeslot;
    return this.tempLocation.save();
  })
  .then( () => {
    return this.tempTimeslot;
  });
};
