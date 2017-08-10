var mongoose = require('mongoose');
var poemSchema = mongoose.Schema({
    title: String,
    author: [ {type: mongoose.Schema.Types.ObjectId, ref:"userModel"}],
    //Todo: maybe store as list of arrays
    text: String
}, {collection: "poem"});
module.exports = poemSchema;