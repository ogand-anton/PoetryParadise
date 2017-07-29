module.exports = function (app) {
    var favorites = [
            {_id: "1", userId: "123", author: "Percy Bysshe Shelley", title: "Ozymandias"}
        ],
        nextId = 1;

    app.delete("/api/poem/:userId", unFavoritePoem);
    app.get("/api/poem/:userId", findFavoritesByUser);
    app.put("/api/poem/:userId", favoritePoem);

    function favoritePoem(req, res) {
        var retObj = {},
            favorite = {
                userId: req.params.userId,
                author: req.query.author,
                title: req.query.title
            };

        if (!(favorite.userId && favorite.author && favorite.title)) {
            retObj.msg = "Favorite must have user, author, and title";
        } else {
            var existingFavorite = _findFavorite(favorite);

            if (existingFavorite) {
                favorite = existingFavorite;
            } else {
                favorite._id = (nextId++).toString();
                favorites.push(favorite);
            }

            retObj.favorite = favorite;
        }

        res.json(retObj);
    }

    function findFavoritesByUser(req, res) {
        var retObj = {},
            userId = req.params.userId;

        retObj.favorites = _getUserFavorites(userId);

        res.json(retObj);
    }

    function unFavoritePoem(req, res){
        var retObj = {},
            userId = req.params.userId,
            favoriteId = req.query.favoriteId;

        for (var i = 0; i < favorites.length; i++) {
            if (favorites[i].userId === userId && favorites[i]._id === favoriteId) {
                favorites.splice(i, 1);
                break;
            }
        }

        res.json(retObj);
    }

    function _findFavorite(favorite) {
        for (var i = 0; i < favorites.length; i++) {
            if (favorites[i].userId === favorite.userId &&
                favorites[i].author === favorite.author &&
                favorites[i].title === favorite.title) {
                return favorites[i];
            }
        }
    }

    function _getUserFavorites(userId) {
        var userFavorites = [];

        for (var i = 0; i < favorites.length; i++) {
            if (favorites[i].userId === userId) {
                userFavorites.push(favorites[i]);
            }
        }

        return userFavorites;
    }
};