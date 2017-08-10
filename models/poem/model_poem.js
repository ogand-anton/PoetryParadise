var mongoose = require('mongoose');
var poemSchema = require('./model_poem');
var poemModel = mongoose.model("poemModel", poemSchema);
poemModel.createPoem = createPoem;
poemModel.findAllPoemsByAuthor = findAllPoemsByAuthor;
poemModel.findPoemById = findPoemById;
poemMode.updatePoem = updatePoem;
poemModel.deletePoem = deletePoem;
module.exports = poemModel;

function createPoem(poem) {
    return poemModel.create(poem);

}

function findPoemById(poemId) {
    return poemModel.findById(poemId);
}

function findAllPoemsByAuthor (authorId) {
    return poemModel
        .find({author: authorId});
        // .populate('name')
        // .exec();

}

function updatePoem(poemId, poem) {
    return poemModel.update({_id: poemId},
        {$set: poem});

}

function deletePoem(poemId) {
    return poemModel.remove({_id: poemId});

}