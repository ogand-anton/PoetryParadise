module.exports = function () {
    var mongoose = require("mongoose"),
        q = require("q");

    mongoose.Promise = q.Promise;

    var connectionString = 'mongodb://127.0.0.1:27017/pp'; // for local
    if (process.env.MONGODB_USERNAME) { // check if running remotely
        connectionString = 'mongodb://' + process.env.MONGODB_USERNAME + ':' + process.env.MONGODB_PASSWORD;
        connectionString += process.env.MONGODB_LOCATION; // user yours
    }

    return mongoose.connect(connectionString, {useMongoClient: true});
};