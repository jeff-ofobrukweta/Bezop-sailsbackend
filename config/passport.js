var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
TwitterStrategy = require('passport-twitter').Strategy,
FacebookStrategy = require('passport-facebook').Strategy,
request = require('request');
bcryptjs = require('bcryptjs');
GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findOne({ id: id }, function (err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
  clientID: "244824053065-jovhdgp6qcadob0a7j6ka22lef0r7v6a.apps.googleusercontent.com",
  clientSecret: "anP3LWpyssH3EUynXTYE6zXT",
  callbackURL: "http://localhost:80"
},
  function (accessToken, regreshToken, profile, done) {
    process.nextTick(function () {
      User.findOne({ userId: profile.id }).done(function (err, user) {
        if (err) {
          return done(null, err);
        } else {
          if (!user) {
            User.create({ userId: profile.id, userName: profile.username }).done(
              function (err, createUser) {
                if (err) {
                  return done(null, err);
                } else {
                  return done(null, createUser);
                }
              });
          } else {
            return done(null, user);
          }
        }
      });
    });
  }));
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {

    User.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }

      bcryptjs.compare(password, user.password, function (err, res) {
          if (!res)
            return done(null, false, {
              message: 'Invalid Password'
            });
          var returnUser = {
            email: user.email,
            createdAt: user.createdAt,
            id: user.id
          };
          return done(null, returnUser, {
            message: 'Logged In Successfully into cloud clox..'
          });
        });
    });
  }
));

'use strict';
var verifyHandler = (req, token, tokenSecret, profile, done)=> {
  process.nextTick(()=> {
    var url = 'https://graph.facebook.com/v2.4/me?access_token=%s&fields=id,name,email,username,phone_number,password';
    url = url.replace('%s', token);

    var options = { method: 'GET', url: url, json: true };
    request(options, function (err, response) {
      if (err) {
        return done(null, null);
      }

      var data = {
        id: response.body.id,
        username: response.body.username,  //jshint ignore:line
        phone_number: response.body.phone_number,    //jshint ignore:line
        email: response.body.email,
        password: response.body.password
      };
        console.log(`i.e check passport.js for this directory for this line of code:::::::::::::: this is the data from facebook!!!!!!!!!!!${JSON.stringify(data,null,2)}`)
      return done(null, data);
    });
  });
};

passport.use(new FacebookStrategy({
  clientID: 1619209608101225,
  clientSecret: '865f57d38ea24dffebab281500d2debc' ,
  callbackURL: 'http://localhost',
  passReqToCallback: true
}, verifyHandler));