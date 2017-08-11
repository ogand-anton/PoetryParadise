module.exports = function (app, model) {
    var mongoose = require("mongoose"),
        translationModel = model.translationModel;

    app.delete("/api/translation", deleteTranslation);
    app.get("/api/translation", findTranslationById);
    app.get("/api/translations", findTranslations);
    app.post("/api/translation", createTranslation);
    app.put("/api/translation", updateTranslation);

    function createTranslation(req, res) {
        var translation = req.body.translation;
        translation.reviewer = req.user._id;
        translation.poemId = req.poem._id;

        translationModel
            .createTranslation(translation)
            .then(function (translation) {
                res.json(translation);
            }, function () {
                res.status(501).send("Unable to create translation");
            });
    }

    function deleteTranslation(req, res) {
        var translationId = req.query.translationId;

        translationModel
            .deleteTranslation(translationId)
            .then(function () {
                res.sendStatus(200);
            }, function () {
                res.status(404).send("Translation not found");
            });
    }

    function findTranslationById(req, res) {
        var translationId = req.query.translationId;
        if (translationId) {
            translationModel
                .findTranslationById(translationId)
                .then(function (translation) {
                    res.json(translation);
                }, function () {
                    res.status(404).send("Translation not found");
                });
        }
        else {
            res.status(404).send("Translation not specified");
        }
    }

    function findTranslations(req, res) {
        var userId = req.query.userId;
        var poemId = req.query.poemId;
        if (userId) {
            translationModel
                .findAllTranslationsByAuthor(userId)
                .then(function (translations) {
                    res.json(translations);
                }, function () {
                    res.status(404).send("Could not find translations by this author")
                })
        }
        if (poemId) {
            translationModel
                .findAllTranslationsForPoem(poemId)
                .then(function (translations) {
                    res.json(translations);
                }, function () {
                    res.status(404).send("Could not find translations for this poem")
                })
        }
        else {
            res.status(404);
        }
    }

    function updateTranslation(req, res) {
        var translationId = req.body.translationId,
            translation = req.body.translation;

        translationModel
            .updateTranslation(translationId, translation)
            .then(function (translation) {
                res.json(translation);
            }, function () {
                res.status(501).send("Unable to update translation");
            });
    }


};