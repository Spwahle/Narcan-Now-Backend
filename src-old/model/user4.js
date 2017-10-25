'use strict';

// DEPENDECIES
import * as bcrypt from 'bcrypt';
import {randomBytes} from 'crypto';
import * as jwt from 'jsonwebtoken';
import createError from 'http-errors';
import {promisify} from '../lib/util.js';
import * as util from '../lib/util.js';
import Mongoose, {Schema} from 'mongoose';

// SCHEMA
const userSchema =  new Schema({
  email: {type: String, required: true, unique: true},
  username: {type: String, required: true, unique: true},
  passwordHash: {type: String},
  randomHash: {type: String,  unique: true, default: ''},
  avatar: {type: String},
  species: {type: String},
  bio: {type: String},
});

// INSTANCE METHODS
userSchema.methods.passwordCompare = function(password){
 return bcrypt.compare(password, this.passwordHash)
 .then(success => {
  if (!success)
  throw createError(401, 'AUTH ERROR: wrong password');
  return this;
 });
};

userSchema.methods.tokenCreate  = function(){
 this.randomHash = randomBytes(32).toString('base64');
 return this.save()
 .then(user => {
  return jwt.sign({randomHash: this.randomHash}, process.env.SECRET);
 })
 .then(token => {
  return token;
 });
};

const User = Mongoose.model('user', userSchema);
// MODEL

User.validateReqFile = function (req) {
 if(req.files.length > 1){
   return util.removeMulterFiles(req.files)
     .then(() => {
       throw createError(400, 'VALIDATION ERROR: only one file permited');
     });
 }
 let [file] = req.files;
 if(file)
   if(file.fieldname !== 'avatar')
     return util.removeMulterFiles(req.files)
       .then(() => {
         throw createError(400, 'VALIDATION ERROR: file must be for avatar');
       });

 return Promise.resolve(file);
}


// STATIC METHODS
User.create = function (user) {
  if(!user.password || !user.email || !user.username)
    return Promise.reject(
      createError(400, 'VALIDATION ERROR: missing username email or password '));

  let {password} = user;
  user = Object.assign({}, user, {password: undefined});

  return bcrypt.hash(password, 1)
    .then(passwordHash => {
      let data = Object.assign({}, user, {passwordHash}); 
      return new User(data).save();
    });
};

User.createProfileWithPhoto = function(req){
 return Profile.validateReqFile(req)
   .then((file) => {
     return util.s3UploadMulterFileAndClean(file)
       .then((s3Data) => {
         return new Profile({
           owner: req.user._id,
           username: req.user.username, 
           email: req.user.email,
           bio: req.body.bio,
           avatar: s3Data.Location,
         }).save();
       });
   });
};


User.fetch = util.pagerCreate(User);

User.fetchOne = function(req){
 return User.findById(req.params.id)
   .then(user => {
     if(!user)
       throw createError(404, 'NOT FOUND ERROR: user not found'); 
     return user;
   });
};

User.updateUserWithPhoto = function(req) {
 return User.validateReqFile(req)
   .then(file => {
     return util.s3UploadMulterFileAndClean(file)
       .then((s3Data) => {
         let update = {avatar: s3Data.Location};
         if(req.body) update.bio = req.body.bio; 
         if(req.body) update.username = req.body.username
         if(req.body) update.email = req.body.email
         if(req.body) update.species = req.body.species
         return User.findByIdAndUpdate(req.params.id, update, {new: true, runValidators: true});
       });
   });
};

User.update = function(req){
 if(req.files && req.files[0])
   return User.updateUserWithPhoto(req);
 let options = {new: true, runValidators: true};
 return User.findByIdAndUpdate(req.params.id, {bio: req.body.bio, username: req.body.username, email: req.body.email, species: req.body.species}, options);
};

User.delete = function(req){
 return User.findOneAndRemove({_id: req.params.id})
   .then(user => {
     if(!user)
       throw createError(404, 'NOT FOUND ERROR: user not found');
   });
};


// INTERFACE
export default User;
