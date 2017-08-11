module.exports = function () {
    var mongoose = require("mongoose");

    return mongoose.Schema({
        _poem: {type: mongoose.Schema.Types.ObjectId, ref: "poem"},
        reviewer: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
        text: String,
        dateCreated: {type: Date, default: Date.now}
    }, {collection: "review"});
};