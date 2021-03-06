module.exports = function (app, model) {
    var mongoose = require("mongoose");

    var followerModel = model.followerModel,
        userModel = model.userModel;

    app.delete("/api/user", deleteUser);
    app.delete("/api/user/unfollow", unFollowUser);

    app.get("/api/user", findUserByUsername);
    app.get("/api/user/followers", findFollowers);
    app.get("/api/user/:userId", findUserById);
    app.get("/api/user/:userId/followers", findUserFollowers);
    app.get("/api/users", findAllUsers);

    app.post("/api/user/follow", followUser);

    app.put("/api/user/:userId", updateUser);

    function deleteUser(req, res) {
        var userId = req.query.userId;

        userModel
            .deleteUser(userId)
            .then(
                function (result) {
                    res.json(result);
                },
                _genErrorCb(res)
            )
    }

    function findAllUsers(req, res) {
        userModel
            .findAllUsers()
            .then(function(users){
                res.json(users.sort(function(userA, userB) {
                    return userA.username.localeCompare(userB.username, "en", {"sensitivity": "base"});
                }));
            }, _genErrorCb(res));
    }

    function findFollowers(req, res) {
        var userId = req.query.userId;

        followerModel
            .findFollowers(userId)
            .then(function (followers) {
                var userIds = followers.map(function (fol) {return mongoose.Types.ObjectId(fol.followerId)});

                userModel
                    .findUsers(userIds)
                    .then(_genSuccessCb(res), _genErrorCb(res));
            });
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

    function findUserFollowers(req, res) {
        var userId = req.params.userId;

        followerModel
            .findUsersFollowing(userId)
            .then(function (followers) {
                var userIds = followers.map(function (fol) {return mongoose.Types.ObjectId(fol._userId)});

                userModel
                    .findUsers(userIds)
                    .then(_genSuccessCb(res), _genErrorCb(res));
            });
    }

    function followUser(req, res) {
        var userId = req.body.userId,
            followerId = req.body.followerId;

        followerModel
            .addFollower(userId, followerId)
            .then(_genSuccessCb(res), _genErrorCb(res));
    }

    function unFollowUser(req, res) {
        var userId = req.query.userId,
            followerId = req.query.followerId;

        followerModel
            .removeFollower(userId, followerId)
            .then(_genSuccessCb(res), _genErrorCb(res));
    }

    function updateUser(req, res) {
        var userId = req.params.userId,
            newUserInfo = req.body.user;

        if (newUserInfo.password !== newUserInfo.verifyPassword) {
            res.json({msg: "Passwords do not match"});
        } else {
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
    }

    function _genErrorCb(res) {
        return function (err) {
            // res.status(400).send(err); // TODO consider using statuses instead of msg
            res.json({msg: err.message});
        }
    }

    function _genSuccessCb(res, resultName) {
        var output = {};
        return function (results) {
            if (resultName) {
                output[resultName] = results;
                res.json(output);
            } else {
                res.json(results);
            }
        };
    }
};