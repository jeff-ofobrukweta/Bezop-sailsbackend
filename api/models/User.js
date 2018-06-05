/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var bcryptjs = require('bcryptjs');
//var _= require('lodash');
// var _super= require('sails-permissions/api/models/User');
//var usermail = require('usermail');
module.exports = {
  schema:true,
  attributes: {
    firstname: {
      type: 'string',
      required: true
    },
    lastname: {
      type: 'string',
      required: true
    },
    phoneNumber: {
      type: 'string',
      required: true,
      minLength: 11,
    },
    email: {
      type: 'string',
      required: true,
      unique:true
    },
    password: {
      type: 'string',
      required: true,
      minLength: 6,
      unique: true
    },
    files: {
      collection:'Files',
      via: 'owner'
    },
    
    toJSON: function() {
        var obj = this.toObject();
        delete obj.password;
        return obj;
    }
  },
  //Update the user password if it was passed in
  afterValidate: function(values, next) {
    //update the passport-password if it was passed in
    if (values.password && this.user && this.user.id) {
      Passport.update({ user: values.id, protocol: 'local' }, { password: values.password })
        .exec(function (err, passport) {
          delete values.password;
          console.log(`the password is being updated by password here`);
          next(err);
        });
    }
    else {
      next();
    }
  },
  beforeCreate: function(user, cb) {
      bcryptjs.genSalt(10, function(err, salt) {
          bcryptjs.hash(user.password, salt, function(err, hash) {
              if (err) {
                  console.log(err);
                  cb(err);
              } else {
                  user.password = hash;
                  cb();
              }
          });
      });
  },

  //Before update,if a token was passed in,Create a new one
  beforeUpdate:function(values,next){
    if(values.new_token){
      values.validation_token = bcryptjs.hashSync(String(new Date().getTime()));
      console.log('New validation Token');
      console.log(values.validation_token);
      delete values.new_token;
    }
    next();
  },
  afterCreate:function (user, next) {
    //Email the user the validation link after creation
      if(user.email != "admin@example.com"){
        // usermail(user,{
        user_validation_token = bcryptjs.hashSync(String(new Date().getTime()));
        // console.log(String(new Date().getTime()))
        console.log(sails.getBaseUrl() + "/user/" + user.id + "&validation_id" + "/validate-email?email=" + user.email + "&validation_token=" + user_validation_token) 
          // subject:"Validate Email on "+sails.config.appName,
          // template:'validate_email'
        // });
      }
      next();
  }
 
};


