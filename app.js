// dependencies
var bodyParser = require("body-parser"),
    express = require("express"),
    passport = require("passport"),
    cookieParser = require("cookie-parser"),
    session = require("express-session");

// app initialization
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
app.use(session({secret: "this is the secret", resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.listen(process.env.PORT || 3000);

// helper method for importing modules with paths relative to root
app.aoaRequire = function (modulePath) {
    return require(__dirname + "/" + modulePath);
};

// app imports
app.aoaRequire("db.js")();
var model = app.aoaRequire("models/model.js")(app);
app.aoaRequire("services/service_auth.js")(app, model);
app.aoaRequire("services/service_poem.js")(app, model);
app.aoaRequire("services/service_review.js")(app, model);
app.aoaRequire("services/service_search_pdb.js")(app);
app.aoaRequire("services/service_translation.js")(app, model);
app.aoaRequire("services/service_user.js")(app, model);
app.aoaRequire("test/app_test.js")(app);