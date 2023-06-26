const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/userModel');
const passport = require('passport');

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); //to extract token
opts.secretOrKey =process.env.ACCESS_SECRET_KEY

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      // console.log(jwt_payload.email);
      const user = await User.findOne({ _id: jwt_payload.id });
      if (user) {
        // console.log(user);
        return done(null, user);   
      } else {
        console.log("No user found")
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  }
  ));