// dependencies
var bodyParser = require("body-parser"),
    express = require("express");

// app initialization
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.listen(process.env.PORT || 3000);

// helper method for importing modules with paths relative to root
app.aoaRequire = function (modulePath) {
    return require(__dirname + "/" + modulePath);
};

// app imports

app.aoaRequire("db/db.js")();
app.aoaRequire("test/app_test.js")(app);
var model = app.aoaRequire("models/model.js")(app);
app.aoaRequire("services/service_poem.js")(app);
app.aoaRequire("services/service_search_pdb.js")(app);
app.aoaRequire("services/service_user.js")(app, model);