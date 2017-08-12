module.exports = function (app) {
    var mongoose = require("mongoose"),
        followerSchema = app.aoaRequire("models/user/schema_follower.js")(app),
        followerModel = mongoose.model("follower", followerSchema, followerSchema.options.collection);

    return Object.assign(followerModel, {
        addFollower: addFollower,
        findFollowers: findFollowers,
        findUsersFollowing: findUsersFollowing,
        removeFollower: removeFollower
    });

    function addFollower(userId, followerId) {
        return followerModel.create({_userId: userId, followerId: followerId});
    }

    function findFollowers(userId) {
        return followerModel.find({_userId: userId});
    }

    function findUsersFollowing(followerId) {
        return followerModel.find({followerId: followerId})
    }

    function removeFollower(userId, followerId) {
        return followerModel.remove({_userId: userId, followerId: followerId})
    }
};