module.exports = function () {
    var mongoose = require("mongoose");

    return mongoose.Schema({
        username: {type: String, required: true, trim: true, unique: true},
        password: {type: String, required: true},
        firstName: {type: String},
        lastName: {type: String},
        email: {type: String},
        phone: {type: String},
        dateCreated: {type: Date, required: true, default: Date.now}
    }, {collection: "user"});
};