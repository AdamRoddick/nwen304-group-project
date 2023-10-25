const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const GoogleClientID = '39294675712-plngvbk9c04fvn5bk6mgs6jdnjsnobmi.apps.googleusercontent.com';
const GoogleClientSecret = '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';

passport.use(new GoogleStrategy({
    clientID: process.env.GoogleClientID,
    clientSecret: process.env.GoogleClientSecret,
    callbackURL: "https://nwen304-groupproject-9db15.web.app/auth/google/callback",
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