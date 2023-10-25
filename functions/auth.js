const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const GoogleClientID = "39294675712-t64urri7hq32u22iu7k90ja1c9n4pvo6.apps.googleusercontent.com";
const GoogleClientSecret = "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";

passport.use(new GoogleStrategy({
    clientID: GoogleClientID,
    clientSecret: GoogleClientSecret,
    callbackURL: "http://localhost:5000/auth/google/callback",
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