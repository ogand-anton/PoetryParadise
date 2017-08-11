module.exports = function (app) {
    var mongoose = require("mongoose"),
        translationSchema = app.aoaRequire("models/translation/schema_translation")(),
        translationModel = mongoose.model("translationModel", translationSchema, translationSchema.options.collection);

    return Object.assign(translationModel, {
        createTranslation: createTranslation,
        findAllTranslationsByAuthor: findAllTranslationsByAuthor,
        findTranslationById: findTranslationById,
        updateTranslation: updateTranslation,
        deleteTranslation: deleteTranslation
    });

    function createTranslation(translation) {
        return translationModel.create(translation);
    }

    function deleteTranslation(translationId) {
        return translationModel.remove({_id: translationId});
    }

    function findTranslationById(translationId) {
        return translationModel.findById(translationId);
    }

    function findAllTranslationsByAuthor(authorId) {
        return translationModel
            .find({author: authorId});
        // .populate('name')
        // .exec();
    }

    function updateTranslation(translationId, translation) {
        return translationModel.update({_id: translationId}, {$set: translation});
    }
};