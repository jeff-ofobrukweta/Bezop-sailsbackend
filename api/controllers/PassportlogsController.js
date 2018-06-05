/**
 * PassportlogsController
 *
 * @description :: Server-side logic for managing passportlogs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


var passport = require('passport');
var http = require('../../config/passport');

module.exports = {
    login: function (req, res) {
        passport.authenticate('local', function (err, user, info) {
            if ((err) || (!user)) {
                return res.send({
                    message: info.message,
                    user: user
                });
            }
            req.logIn(user, function (err) {
                if (err) res.send(err);
                return res.send({
                    message: info.message,
                    user: user
                });
            });
         //console.log("this is the req.session part"+JSON.stringify(req.session,null,2));

        })(req, res);
    },


    logout: function (req, res) {
        delete req.logout();
        delete req.session;
        res.json({sucess:true});
    },
    // Here is were we specify our facebook strategy.
    // https://developers.facebook.com/docs/
    // https://developers.facebook.com/docs/reference/login/

    facebookAuth: function (req, res, next) {
        passport.authenticate('facebook', { scope: ['email'] })(req, res, next);
        //console.log(res)
    },

    facebookCallback: function (req, res, next) {
        passport.authenticate('facebook', function (err, user) {
           res.json(user);
        })(req, res, next);
    },
    // https://developers.google.com/
    // https://developers.google.com/accounts/docs/OAuth2Login#scope-param

    authenticate: function (req, res) {
        passport.authenticate('google', { failureRedirect: '/', scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read'] }, function (err, user) {
            req.logIn(user, function (err) {
                if (err) {
                    console.log(err);
                    res.view('500');
                    return;
                }
                console.log(user)
                res.redirect('/');
                return;
            });
        })(req, res);
    },

    authcallback: function (req, res) {
        passport.authenticate('google', { failureRedirect: 'login', successRedirect: '/' })(req, res);
    },

    _config: {}
};

