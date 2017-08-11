module.exports = function (app) {
    var mongoose = require("mongoose"),
        testSchema = app.aoaRequire("/test/schema_test");

    var testModel = mongoose.model("Test", testSchema, testSchema.options.collection);

    return Object.assign(testModel, {
        createMessage: createMessage,
        deleteMessage: deleteMessage,
        findAllMessages: findAllMessages
    });

    function createMessage(message) {
        return testModel.create(message)
    }

    function deleteMessage(messageId) {
        return testModel.remove({_id: messageId});
    }

    function findAllMessages() {
        return testModel.find();
    }
};