module.exports = function (app, model) {
    var mongoose = require("mongoose"),
        poemModel = model.poemModel,
        poemFavoriteModel = model.poemFavoriteModel,
        userModel = model.userModel;

    app.delete("/api/poem/:userId", unFavoritePoem);
    app.get("/api/poem/users", findFavoriteUsers);
    app.get("/api/poem/:userId", findFavoritesByUser);
    app.put("/api/poem/:userId", favoritePoem);
    app.get("/api/poem", findPoemById);
    app.get("/api/poems", findPoemsByUser);
    app.post("/api/poem", handlePoem);

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

    function findFavoriteUsers(req, res) {
        var author = req.query.author,
            title = req.query.title;

        poemFavoriteModel
            .findFavorites(author, title)
            .then(function (favorites) {
                var userIds = favorites.map(function (fav) {return mongoose.Types.ObjectId(fav._userId)});

                userModel
                    .findUsers(userIds)
                    .then(_genSuccessCb(res), _genErrorCb(res));
            });
    }

    function findFavoritesByUser(req, res) {
        var userId = req.params.userId;

        poemFavoriteModel
            .findFavoritesByUser(userId)
            .then(_genSuccessCb(res, "favorites"), _genErrorCb(res));
    }

    function findPoemById(req, res) {
        var poemId = req.query.poemId;
        if (poemId) {
            poemModel
                .findPoemById(poemId)
                .then(function (poem) {
                    res.json(poem);
                }, function () {
                    res.status(404).send("Poem not found");
                });
        }
        else {
            res.status(404).send("Poem not specified");
        }
    }

    function findPoemsByUser(req, res) {
        var userId = req.query.userId;
        if (userId) {
            poemModel
                .findAllPoemsByAuthor(userId)
                .then(function (poems) {
                    res.json(poems);
                }, function () {
                    res.status(404).send("could not find poems by this author")
                })
        } else if (req.user && req.user._id) {
            poemModel
                .findAllPoemsByAuthor(req.user._id)
                .then(function (poems) {
                    res.json(poems);
                }, function () {
                    res.status(404).send("could not find poems by this author")
                })
        } else {
            res.status(404);
        }
    }

    function handlePoem(req, res) {
        var poemId = req.body.poemId,
            poem = req.body.poem,
            deleteFlag = req.body.deleteFlag;

        if (poemId) {
            poemModel
                .updatePoem(poemId, poem)
                .then(function (poem) {
                    res.json(poem);
                }, function () {
                    res.status(501).send("unable to update poem");
                });
        }
        else if (deleteFlag) {
            poemModel
                .deletePoem(poemId)
                .then(function () {
                    res.status(200);
                });
        }
        else {
            poem.author = req.user._id;
            poemModel
                .createPoem(poem)
                .then(function (poem) {
                    res.json(poem);
                }, function () {
                    res.status(501).send("unable to create poem");
                });
        }
    }

    function unFavoritePoem(req, res) {
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