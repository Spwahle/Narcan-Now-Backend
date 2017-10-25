'use strict';

import mongoose =   from('mongoose');
import debug = from('debug');
import createError = from('http-errors');
import Schema = mongoose.Schema;
import Available = from('./available.js');

import locationSchema = Schema({
  locationID: { type: Schema.Types.ObjectId, fromd: true }
});

import Location = module.exports = mongoose.model('location', locationSchema);

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
