module.exports = function (app) {
    var mongoose = require("mongoose"),
        bcrypt = require("bcrypt-nodejs"),
        userSchema = app.aoaRequire("models/user/schema_user.js")(app),
        userModel = mongoose.model("user", userSchema, userSchema.options.collection);

    return Object.assign(userModel, {
        createUser: createUser,
        deleteUser: deleteUser,
        findAllUsers: findAllUsers,
        findUserByCredentials: findUserByCredentials,
        findUserByFacebookId: findUserByFacebookId,
        findUserByGoogleId: findUserByGoogleId,
        findUserById: findUserById,
        findUserByUsername: findUserByUsername,
        findUsers: findUsers,
        updateUser: updateUser
    });

    function createUser(user) {
        if (user.password) {
            user.password = bcrypt.hashSync(user.password);
        }
        return userModel.create(user)
    }

    function deleteUser(userId) {
        return userModel.remove({_id: userId});
    }

    function findAllUsers() {
        return userModel.find({});
    }

    function findUserByCredentials(username, password) {
        return userModel
            .findOne({username: username})
            .select("+password")
            .exec(function (err, user) {
                if (err) return err;

                try {
                    if (bcrypt.compareSync(password, user.password)) {
                        return user;
                    }
                }
                catch (ex) {
                    return undefined;
                }
            });
    }

    function findUserById(userId) {
        return userModel.findOne({_id: userId});
    }

    function findUserByFacebookId(facebookId) {
        return userModel.findOne({"facebook.id": facebookId});
    }

    function findUserByGoogleId(googleId) {
        return userModel.findOne({"google.id": googleId});
    }

    function findUserByUsername(username) {
        return userModel.findOne({username: username});
    }

    function findUsers(userIds) {
        return userModel.find({_id: {$in: userIds}});
    }

    function updateUser(userId, user) {
        if (user.password) {
            user.password = bcrypt.hashSync(user.password);
        }
        return userModel.update({_id: userId}, {$set: user});
    }
};