module.exports = function (app) {
    var users = [
            {_id: "123", username: "alice", password: "alice", firstName: "Alice", lastName: "Wonder", emailAddress: "alice@wonderland.com"},
            {_id: "234", username: "bob", password: "bob", firstName: "Bob", lastName: "Marley"},
            {_id: "345", username: "charly", password: "charly", firstName: "Charly", lastName: "Garcia"},
            {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose", lastName: "Annunzi"}
        ],
        nextId = 666;

    app.get("/api/login", findUserByCredentials);
    app.get("/api/user", findUserByUsername);
    app.get("/api/user/:userId", findUserById);
    app.delete("/api/user/:userId", deleteUser);
    app.post("/api/user", createUser);
    app.put("/api/user/:userId", updateUser);

    function createUser(req, res) {
        var retObj = {},
            user = {
                username: req.query.username,
                password: req.query.password,
                emailAddress: req.query.emailAddress
            },
            passwordVerified = req.query.verifyPassword;

        if (!(user.username && user.password)) {
            retObj.msg = "User must have a username and a password";
        } else if (user.password !== passwordVerified) {
            retObj.msg = "Passwords do not match";
        } else {
            if (!_findUserByUsername(user.username)) {
                user._id = (nextId++).toString();
                users.push(user);
                retObj.user = user;
            } else {
                retObj.msg = "Username not available";
            }
        }

        res.json(retObj);
    }

    function deleteUser(req, res) {
        var retObj = {},
            userId = req.param.userId,
            foundFlag = false;

        for (var i = 0; i < users.length && !foundFlag; i++) {
            if (users[i]._id === userId) {
                users.splice(0, 1);
                foundFlag = true;
            }
        }

        if (!foundFlag) {
            retObj.msg = "User with id '" + userId + "' not found";
        }

        res.json(retObj);
    }

    function findUserByUsername(req, res) {
        var retObj = {},
            username = req.query.username;

        var user = _findUserByUsername(username);

        retObj.user = user;
        retObj.msg = user ? null : "User with username '" + username + "' not found";

        res.json(retObj);
    }

    function findUserByCredentials(req, res) {
        var retObj = {},
            username = req.query.username,
            password = req.query.password;

        var user = _findUserByUsername(username);

        if (user) {
            if (user.password === password) {
                retObj.user = user;
            } else {
                retObj.msg = "Invalid password";
            }
        } else {
            retObj.msg = "Username not found";
        }

        res.json(retObj);
    }

    function findUserById(req, res) {
        var retObj = {},
            userId = req.params.userId;

        var user = _findUserById(userId);

        retObj.msg = user ? null : "User with id '" + userId + "' not found";
        retObj.user = user;

        res.json(retObj);
    }

    function updateUser(req, res) {
        var retObj = {},
            userId = req.params.userId,
            newUserInfo = {
                username: req.query.username,
                password: req.query.password,
                firstName: req.query.firstName,
                lastName: req.query.lastName,
                emailAddress: req.query.emailAddress
            };

        var user = _findUserById(userId);

        if (user) {
            var userWithSameUsername = _findUserByUsername(newUserInfo.username);

            if (!userWithSameUsername || userWithSameUsername._id === user._id) {
                user.username = newUserInfo.username || user.username;  // not clearable, yet
                user.password = newUserInfo.password || user.password;  // not clearable, yet
                user.firstName = newUserInfo.firstName;
                user.lastName = newUserInfo.lastName;
                user.emailAddress = newUserInfo.emailAddress;
                retObj.user = user;
            }
            else {
                retObj.msg = "Username unavailable";
            }
        }
        else {
            retObj.msg = "User with id '" + userId + "' not found";
        }

        res.json(retObj);
    }

    function _findUserById(userId) {
        var user = null;

        for (var i = 0; i < users.length; i++) {
            if (users[i]._id === userId) {
                user = users[i];
                break;
            }
        }

        return user;
    }

    function _findUserByUsername(username) {
        var user = null;

        for (var i = 0; i < users.length; i++) {
            if (users[i].username === username) {
                user = users[i];
                break;
            }
        }

        return user;
    }
};