module.exports = function () {
    var mongoose = require("mongoose");
    //TODO: bring this into users schema using two arrays: followers and following
    return mongoose.Schema({
        _userId: {type: mongoose.Schema.Types.ObjectId, ref: "user"}, // who is doing the following
        followerId: {type: mongoose.Schema.Types.ObjectId, ref: "user"}, // who is being followed
        dateCreated: {type: Date, required: true, default: Date.now}
    }, {collection: "follower"});
};