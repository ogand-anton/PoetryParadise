module.exports = function (app) {
    return {
        userModel: app.aoaRequire("models/user/model_user.js")(app)
    };
};