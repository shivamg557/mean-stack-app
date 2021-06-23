const JwtStrategy = require('passport-jwt').Strategy;
var passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config/database');
var session = require('express-session');

module.exports=function(app,passport){
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(session({ secret: 'keyboard cat',resave:false,saveUninitialized:true,cookie:{secure:false} }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new FacebookStrategy({
    clientID: '499201714466081',
    clientSecret: '91cb1d6ca651b2754e4d4d27882602e7',
    callbackURL: "http://localhost:4200/auth/facebook/callback",
    profileFields:["id","displayname","photos","email"]
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile)
    //User.findOrCreate(..., function(err, user) {
      //if (err) { return done(err); }
      done(null, user);
    }
    ));

  app.get('/auth/facebook', passport.authenticate('facebook'));

  app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',failureRedirect: '/login' }));

  app.get('/auth/facebook',passport.authenticate('facebook', { scope: 'email' })
  );
  }



module.exports = function(passport){
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    User.getUserById(jwt_payload.data._id, (err, user) => {
      if(err){
        return done(err, false);
      }

      if(user){
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));
}


