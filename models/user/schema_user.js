module.exports = function () {
    var mongoose = require("mongoose");

    return mongoose.Schema({
        username: {type: String, required: true, trim: true, unique: true},
        password: {type: String, required: true, select: false},
        firstName: {type: String},
        lastName: {type: String},
        emailAddress: {type: String},
        phone: {type: String},
        google: {
            id: {type: String},
            token: {type: String}
        },
        dateCreated: {type: Date, required: true, default: Date.now}
    }, {collection: "user"});
};