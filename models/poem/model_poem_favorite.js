module.exports = function (app) {
    var mongoose = require("mongoose"),
        poemFavoriteSchema = app.aoaRequire("models/poem/schema_poem_favorite.js")(app),
        poemFavoriteModel = mongoose.model("poemFavoriteModel", poemFavoriteSchema, poemFavoriteSchema.options.collection);

    return Object.assign(poemFavoriteModel, {
        addFavorite: addFavorite,
        findFavorites: findFavorites,
        removeFavorite: removeFavorite
    });

    function addFavorite(userId, author, title) {
        return poemFavoriteModel.create({
            _userId: userId,
            author: author,
            title: title
        });
    }

    function findFavorites(userId) {
        return poemFavoriteModel.find({_userId: userId});
    }

    function removeFavorite(userId, favoriteId) {
        return poemFavoriteModel.remove({_id: favoriteId, _userId: userId});
    }
};