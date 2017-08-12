module.exports = function (app) {
    var mongoose = require("mongoose"),
        poemFavoriteSchema = app.aoaRequire("models/poem/schema_poem_favorite.js")(app),
        poemFavoriteModel = mongoose.model("poemFavorite", poemFavoriteSchema, poemFavoriteSchema.options.collection);

    return Object.assign(poemFavoriteModel, {
        addFavorite: addFavorite,
        findFavorites: findFavorites,
        findFavoritesByUser: findFavoritesByUser,
        removeFavorite: removeFavorite
    });

    function addFavorite(userId, author, title) {
        return poemFavoriteModel.create({
            _userId: userId,
            author: author,
            title: title
        });
    }

    function findFavorites(author, title) {
        return poemFavoriteModel.find({author: author, title: title}, function(err, favorites){
            return favorites;
        });
    }

    function findFavoritesByUser(userId) {
        return poemFavoriteModel.find({_userId: userId});
    }

    function removeFavorite(userId, favoriteId) {
        return poemFavoriteModel.remove({_id: favoriteId, _userId: userId});
    }
};