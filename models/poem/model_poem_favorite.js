module.exports = function (app) {
    var mongoose = require("mongoose"),
        poemFavoriteSchema = app.aoaRequire("models/poem/schema_poem_favorite.js")(app),
        poemFavoriteModel = mongoose.model("poemFavorite", poemFavoriteSchema, poemFavoriteSchema.options.collection);

    return Object.assign(poemFavoriteModel, {
        addFavorite: addFavorite,
        deleteFavorite: deleteFavorite,
        findFavorites: findFavorites,
        findFavoritesByUser: findFavoritesByUser
    });

    function addFavorite(userId, author, title) {
        return poemFavoriteModel.create({
            _user: userId,
            author: author,
            title: title
        });
    }

    function deleteFavorite(userId, favoriteId) {
        return poemFavoriteModel.remove({_id: favoriteId, _user: userId});
    }

    function findFavorites(author, title) {
        return poemFavoriteModel
            .find({author: author, title: title})
            .populate("_user");
    }

    function findFavoritesByUser(userId) {
        return poemFavoriteModel.find({_user: userId});
    }
};