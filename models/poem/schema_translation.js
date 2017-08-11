module.exports = function() {
    var mongoose = require("mongoose");

    return mongoose.Schema({
        title: {type: String},
        originalPoem: {type: mongoose.Schema.Types.ObjectId, ref: "poem"},
        author: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
        lines: {type: [String]}
    }, {collection: "translation"});
};