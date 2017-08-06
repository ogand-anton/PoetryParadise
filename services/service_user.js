module.exports = function (app, model) {
    var userModel = model.userModel;

    app.delete("/api/user/:userId", deleteUser);
    app.get("/api/login", login);
    app.get("/api/user", findUserByUsername);
    app.get("/api/user/:userId", findUserById);
    app.post("/api/user", createUser);
    app.put("/api/user/:userId", updateUser);

    function createUser(req, res) {
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
                .then(
                    function (user) {
                        if (user) {
                            res.json({msg: "Username taken"});
                        } else {
                            userModel
                                .createUser(newUser)
                                .then(_genSuccessCb(res), _genErrorCb(res));
                        }
                    }
                )
        }
    }

    function deleteUser(req, res) {
        var userId = req.param.userId;

        userModel
            .deleteUser(userId)
            .then(
                function (result) {
                    res.json(result);
                },
                _genErrorCb(res)
            )
    }

    function findUserByUsername(req, res) {
        var username = req.query.username;

        userModel
            .findUserByUsername(username)
            .then(
                function (user) {
                    if (user) {
                        res.json({user: user});
                    } else {
                        res.json({msg: "User not found"});
                    }
                }
            );
    }

    function findUserById(req, res) {
        var userId = req.params.userId;

        userModel
            .findUserById(userId)
            .then(
                function (user) {
                    if (user) {
                        res.json({user: user});
                    } else {
                        res.json({msg: "User not found"});
                    }
                },
                _genErrorCb(res));
    }

    function login(req, res) {
        var username = req.query.username,
            password = req.query.password;

        userModel
            .findUserByCredentials(username, password)
            .then(
                function (user) {
                    if (user) {
                        res.json({user: user});
                    } else {
                        res.json({msg: "Credentials not valid"});
                    }
                }
            );
    }

    function updateUser(req, res) {
        var userId = req.params.userId,
            newUserInfo = {
                username: req.query.username,
                password: req.query.password,
                firstName: req.query.firstName,
                lastName: req.query.lastName,
                emailAddress: req.query.emailAddress
            };

        userModel
            .findUserById(userId)
            .then(function (user) {
                if (user) {
                    userModel
                        .findUserByUsername(newUserInfo.username)
                        .then(function (newUser) {
                            if (!newUser || newUser._id.equals(userId)) {
                                userModel
                                    .updateUser(userId, newUserInfo)
                                    .then(
                                        function (updatedUser) {
                                            res.json({user: updatedUser});
                                        },
                                        _genErrorCb(res)
                                    )
                            } else {
                                res.json({msg: "Username unavailable"});
                            }
                        })

                } else {
                    res.json({msg: "User not found"});
                }
            });
    }

    function _genErrorCb(res) {
        return function (err) {
            // res.status(400).send(err); // TODO consider using statuses instead of msg
            res.json({msg: err.message});
        }
    }

    function _genSuccessCb(res) {
        return function (results) {
            res.json({user: results});
        };
    }
};