module.exports = function() {
    var mongoose = require("mongoose");

    return mongoose.Schema({
        title: {type: String},
        author: [{type: mongoose.Schema.Types.ObjectId, ref: "userModel"}],
        text: {type: [String]}
    }, {collection: "poem"});
};