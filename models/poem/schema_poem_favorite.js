module.exports = function () {
    var mongoose = require("mongoose");

    return mongoose.Schema({
        _userId: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
        author: {type: String, required: true},
        title: {type: String, required: true},
        dateCreated: {type: Date, required: true, default: Date.now}
    }, {collection: "poemFavorite"});
};