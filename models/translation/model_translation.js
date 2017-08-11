module.exports = function (app) {
    var mongoose = require("mongoose"),
        translationSchema = app.aoaRequire("models/translation/schema_translation")(),
        translationModel = mongoose.model("translation", translationSchema, translationSchema.options.collection);

    return Object.assign(translationModel, {
        createTranslation: createTranslation,
        deleteTranslation: deleteTranslation,
        findTranslationsByAuthor: findTranslationsByAuthor,
        findTranslationsForPoem: findTranslationsForPoem,
        findTranslationById: findTranslationById,
        updateTranslation: updateTranslation
    });

    function createTranslation(translation) {
        return translationModel.create(translation);
    }

    function deleteTranslation(translationId) {
        return translationModel.remove({_id: translationId});
    }

    function findTranslationsByAuthor(authorId) {
        return translationModel
            .find({author: authorId})
            .populate("author")
            .exec();
    }

    function findTranslationById(translationId) {
        return translationModel
            .findById(translationId)
            .populate("author");
    }

    function findTranslationsForPoem(poemId) {
        return translationModel
            .find({originalPoem: poemId})
            .populate("author");
    }

    function updateTranslation(translationId, translation) {
        return translationModel.update({_id: translationId}, {$set: translation});
    }
};