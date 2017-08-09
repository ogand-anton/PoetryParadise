module.exports = function (app, model) {
    var passport = require("passport"),
        LocalStrategy = require("passport-local").Strategy;

    var userModel = model.userModel;

    passport.use(new LocalStrategy(_localStrategy));
    passport.serializeUser(_serializeUser);
    passport.deserializeUser(_deserializeUser);

    app.get("/api/authenticated", authenticated);
    app.post("/api/login", passport.authenticate("local"), login);
    app.post("/api/logout", logout);

    function authenticated(req, res) {
        res.json(req.isAuthenticated() ? req.user : "0");
    }

    function login(req, res) {
        res.json(req.user); // user is stored on req by passport
    }

    function logout(req, res) {
        req.logOut(); // req.logOut() is a passport method
        res.sendStatus(200);
    }

    // PASSPORT
    function _deserializeUser(user, done) {
        userModel
            .findUserById(user._id)
            .then(
                function (user) {
                    done(null, user);
                },
                function (err) {
                    done(err, null);
                }
            );
    }

    // PASSPORT
    function _serializeUser(user, done) {
        done(null, user);
    }

    // PASSPORT: authenticate a new session
    function _localStrategy(username, password, done) {
        userModel
            .findUserByCredentials(username, password)
            .then(
                function (user) {
                    return done(null, user || false);
                },
                function (err) {
                    if (err) { return done(err); }
                }
            );
    }
};