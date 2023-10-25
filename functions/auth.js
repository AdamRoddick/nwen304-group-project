const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const GoogleClientID = '650668238065-r6dv4kc5vu6ge55j6mtskdvbpmtfjodf.apps.googleusercontent.com';
const GoogleClientSecret = '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';

passport.use(new GoogleStrategy({
    clientID: GoogleClientID,
    clientSecret: GoogleClientSecret,
    callbackURL: "/auth/google/callback",
    passReqToCallback: true
},
    function (request, accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user)
});