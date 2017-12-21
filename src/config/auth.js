const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;       // username + password
const BearerStrategy = require('passport-http-bearer').Strategy;    // token

const userCtrl = require('../storage/controllers/usersController');

module.exports = (app) => {
    passport.use('basic', new BasicStrategy(
        async function (username, password, done) {
            console.log('!!!!',username, password);
            try {
                const user = await userCtrl.get.byCredentials(username, password);
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            } catch (err) {
                return done(err);
            }
        }));
    passport.use('bearer-access', new BearerStrategy(
        async function (token, done) {
            try {
                const user = await userCtrl.get.byAccessToken(token);
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            } catch (err) {
                return done(err);
            }
        }
    ));
    passport.use('bearer-refresh', new BearerStrategy(
        async function (token, done) {
            try {
                const user = await userCtrl.get.byRefreshToken(token);
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            } catch (err) {
                return done(err);
            }
        }
    ));

    app.use(passport.initialize());
    console.log("+Auth configured");
}