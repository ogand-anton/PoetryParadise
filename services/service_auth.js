module.exports = function (app, model) {
    var googleConfig = {
            clientID: process.env.GOOGLE_CLIENTID,
            clientSecret: process.env.GOOGLE_CLIENTSECRET,
            callbackURL: process.env.GOOGLE_CALLBACK
        },
        facebookConfig = {
            clientID: process.env.FACEBOOK_CLIENTID,
            clientSecret: process.env.FACEBOOK_CLIENTSECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK
        };

    var passport = require("passport"),
        LocalStrategy = require("passport-local").Strategy,
        GoogleStrategy = require("passport-google-oauth").OAuth2Strategy,
        FacebookStrategy = require("passport-facebook").Strategy;

    var userModel = model.userModel;

    passport.use(new LocalStrategy(_localStrategy));
    if (process.env.GOOGLE_CLIENTID) {
        passport.use(new GoogleStrategy(googleConfig, _googleStrategy));
    }
    if (process.env.FACEBOOK_CLIENTID) {
        passport.use(new FacebookStrategy(facebookConfig, _facebookStrategy));
    }
    passport.serializeUser(_serializeUser);
    passport.deserializeUser(_deserializeUser);

    app.get("/api/authenticated", authenticated);
    app.get("/api/login/facebook", passport.authenticate("facebook", {scope: "email"}));
    app.get("/api/login/facebook/callback", passport.authenticate("facebook", {
        successRedirect: "/#/profile",
        failureRedirect: "/#/login"
        }));
    app.get("/api/login/google", passport.authenticate("google", {scope: ["profile", "email"]}));
    app.get("/api/login/google/callback", passport.authenticate("google", {
        successRedirect: "/#/profile",
        failureRedirect: "/#/login"
    }));
    app.post("/api/login", passport.authenticate("local"), login);
    app.post("/api/logout", logout);
    app.post("/api/register", registerUser);

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

    function registerUser(req, res) {
        var newUser = {
                username: req.query.username,
                password: req.query.password,
                emailAddress: req.query.emailAddress
            },
            passwordVerified = req.query.verifyPassword;

        if (!(newUser.username && newUser.password)) {
            res.json({msg: "User must have a username and a password"});
        } else if (newUser.password !== passwordVerified) {
            res.json({msg: "Passwords do not match"});
        } else {
            userModel
                .findUserByUsername(newUser.username)
                .then(function (user) {
                    if (user) {
                        res.json({msg: "Username taken"});
                        return user;
                    }
                })
                .then(function (user) {
                    if (user) {
                        return user;
                    }

                    userModel
                        .createUser(newUser)
                        .then(function (user) {
                            if (user) {
                                req.login(user, function (err) {
                                    if (err) {
                                        res.status(400).send(err);
                                    } else {
                                        res.json(user);
                                    }
                                });
                            }
                        });
                })
        }
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

    // PASSPORT
    function _facebookStrategy(token, refreshToken, profile, done) {
        userModel
            .findUserByFacebookId(profile.id)
            .then(function (user) {
                if (user) {
                    return done(null, user);
                } else {
                    var newFacebookUser = {
                            username: profile.displayName.split(" ").join(""),
                            firstName: profile.name.givenName,
                            lastName: profile.name.familyName,
                            facebook: {
                                id: profile.id,
                                token: token
                            }
                        };

                    return userModel.createUser(newFacebookUser);
                }
            }, function (err) {
                if (err) { return done(err); }
            })
            .then(function (user) {
                return done(null, user);
            }, function (err) {
                if (err) { return done(err); }
            });
    }

    // PASSPORT
    function _googleStrategy(token, refreshToken, profile, done) {
        userModel
            .findUserByGoogleId(profile.id)
            .then(function (user) {
                if (user) {
                    return done(null, user);
                } else {
                    var email = profile.emails[0].value,
                        emailParts = email.split("@"),
                        newGoogleUser = {
                            username: emailParts[0],
                            firstName: profile.name.givenName,
                            lastName: profile.name.familyName,
                            emailAddress: email,
                            google: {
                                id: profile.id,
                                token: token
                            }
                        };

                    return userModel.createUser(newGoogleUser);
                }
            }, function (err) {
                if (err) { return done(err); }
            })
            .then(function (user) {
                return done(null, user);
            }, function (err) {
                if (err) { return done(err); }
            });
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