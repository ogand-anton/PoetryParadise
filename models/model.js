module.exports = function (app) {
    return {
        followerModel: app.aoaRequire("models/user/model_follower.js")(app),
        poemModel: app.aoaRequire("models/poem/model_poem.js")(app),
        poemFavoriteModel: app.aoaRequire("models/poem/model_poem_favorite.js")(app),
        reviewModel: app.aoaRequire("models/review/model_review.js")(app),
        translationModel: app.aoaRequire("models/translation/model_translation.js")(app),
        userModel: app.aoaRequire("models/user/model_user.js")(app)
    };
};