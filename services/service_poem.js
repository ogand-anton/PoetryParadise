module.exports = function (app, model) {
    var poemFavoriteModel = model.poemFavoriteModel;

    app.delete("/api/poem/:userId", unFavoritePoem);
    app.get("/api/poem/:userId", findFavoritesByUser);
    app.put("/api/poem/:userId", favoritePoem);

    function favoritePoem(req, res) {
        var userId = req.params.userId,
            author = req.query.author,
            title = req.query.title;

        if (!(userId && author && title)) {
            res.json({msg: "Favorite must have user, author, and title"});
        } else {
            poemFavoriteModel
                .addFavorite(userId, author, title)
                .then(_genSuccessCb(res), _genErrorCb(res));
        }
    }

    function findFavoritesByUser(req, res) {
        var userId = req.params.userId;

        poemFavoriteModel
            .findFavorites(userId)
            .then(_genSuccessCb(res, "favorites"), _genErrorCb(res));
    }

    function unFavoritePoem(req, res){
        var userId = req.params.userId,
            favoriteId = req.query.favoriteId;

        poemFavoriteModel
            .removeFavorite(userId, favoriteId)
            .then(_genSuccessCb(res), _genErrorCb(res));
    }

    function _genErrorCb(res) {
        return function (err) {
            // res.status(400).send(err);
            res.json({msg: err.message});
        }
    }

    function _genSuccessCb(res, resultName) {
        var output = {};
        return function (results) {
            if (resultName) {
                output[resultName] = results;
                res.json(output);
            } else {
                res.json(results);
            }
        };
    }
};