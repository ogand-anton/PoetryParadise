module.exports = function () {
    var mongoose = require("mongoose");

    return mongoose.Schema({
        _poemId: {type: mongoose.Schema.Types.ObjectId, ref: "poem"},
        _userId: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
        reviewText: String,
        dateCreated: {type: Date, default: Date.now}
    }, {collection: "review"});
};