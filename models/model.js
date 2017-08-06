module.exports = function (app) {
    return {
        poemFavoriteModel: app.aoaRequire("models/poem/model_poem_favorite.js")(app),
        userModel: app.aoaRequire("models/user/model_user.js")(app)
    };
};