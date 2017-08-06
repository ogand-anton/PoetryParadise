module.exports = getTestSchema();

function getTestSchema() {
    var mongoose = require("mongoose");
    return mongoose.Schema({message: String}, {collection: "test"});
}