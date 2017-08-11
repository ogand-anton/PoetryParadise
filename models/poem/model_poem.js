module.exports = function (app) {
    var mongoose = require("mongoose"),
        poemSchema = app.aoaRequire("models/poem/schema_poem")(),
        poemModel = mongoose.model("poem", poemSchema, poemSchema.options.collection);

    return Object.assign(poemModel, {
        createPoem: createPoem,
        findAllPoemsByAuthor: findAllPoemsByAuthor,
        findPoemById: findPoemById,
        updatePoem: updatePoem,
        deletePoem: deletePoem
    });

    function createPoem(poem) {
        return poemModel.create(poem);
    }

    function deletePoem(poemId) {
        return poemModel.remove({_id: poemId});
    }

    function findPoemById(poemId) {
        return poemModel.findById(poemId);
    }

    function findAllPoemsByAuthor(authorId) {
        return poemModel
            .find({author: authorId});
        // .populate('name')
        // .exec();
    }

    function updatePoem(poemId, poem) {
        return poemModel.update({_id: poemId}, {$set: poem});
    }
};