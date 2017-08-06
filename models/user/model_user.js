module.exports = function (app) {
    var mongoose = require("mongoose"),
        userSchema = app.aoaRequire("models/user/schema_user.js")(app),
        userModel = mongoose.model("userModel", userSchema, userSchema.options.collection);

    return Object.assign(userModel, {
        createUser: createUser,
        deleteUser: deleteUser,
        findUserByCredentials: findUserByCredentials,
        findUserById: findUserById,
        findUserByUsername: findUserByUsername,
        findUsers: findUsers,
        updateUser: updateUser
    });

    function createUser(user) {
        return userModel.create(user);
    }

    function deleteUser(userId) {
        return userModel.remove({_id: userId});
    }

    function findUserByCredentials(username, password) {
        return userModel.findOne({username: username, password: password});
    }

    function findUserById(userId) {
        return userModel.findOne({_id: userId});
    }

    function findUserByUsername(username) {
        return userModel.findOne({username: username});
    }

    function findUsers(userIds){
        return userModel.find({_id: {$in: userIds}});
    }

    function updateUser(userId, user) {
        return userModel.update({_id: userId}, {$set: user});
    }
};