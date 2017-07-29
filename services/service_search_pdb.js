module.exports = function (app) {
    // chars that need escaping before sending to PoetryDB
    var charEncoding = {
        "%5C": "%5C%5C",    // '\'
        "$": "%5C$",
        "%5E": "%5C%5E",    // '^'
        "+": "%5C%2B",      // '^'
        "(": "%5C(",
        ")": "%5C)",
        ".": "%5C.",
        "*": "%5C*",
        "%5B": "%5C%5B",    // '['
        ";": ""             // remove, ';' has special meaning for PoetryDB
    };

    var http = require("http");

    app.get("/api/search", search);

    function search(req, res) {
        var retObj = {},
            inputs = [],
            searchTerms = [];

        if (req.query.author) {
            inputs.push("author");
            searchTerms.push(req.query.author);
        }
        if (req.query.title) {
            inputs.push("title");
            searchTerms.push(req.query.title);
        }
        if (req.query.lines) {
            inputs.push("lines");
            searchTerms.push(req.query.lines);
        }

        // PoetryDB expects parenthesis to be escaped with backslash %5C
        for (var i = 0; i < searchTerms.length; i++) {
            for (var char in charEncoding) {
                if (charEncoding.hasOwnProperty(char)) {
                    searchTerms[i] = searchTerms[i].replace(char, charEncoding[char]);
                }
            }
        }

        if (inputs.length && searchTerms.length) {
            // path needs to be constructed as follows:
            //  /<in>[,in]/<sch>[;sch][:abs]/<out>[,out][format]
            //  in: author, title, lines, linecount
            //  sch: search strings for each in field, [:abs] absolute matching, lines can be separated by ';'
            //  out: author, title, lines, linecount, all/null
            //  format: .json/null, .text
            var options = {
                host: "poetrydb.org",
                path: "/" + inputs.join(",") + "/" + searchTerms.join(";") + "/all.json"
            };
            http
                .request(options, _genSearchCb(res, retObj))
                .end();
        } else {
            retObj.msg = "No search criteria specified";
            res.json(retObj);
        }
    }

    function _genSearchCb(res, retObj) {
        var str = "";

        return function (dbRes) {
            //another chunk of data has been received
            dbRes.on("data", function (chunk) { str += chunk; });

            //the whole response has been received
            dbRes.on("end", function () {
                var results;
                try {
                    results = JSON.parse(str);
                }
                catch (ex) {
                    results = {status: 404, reason: "Not found"}; // request broken due to url issues
                }

                var notFoundFlag = results.status === 404 && results.reason === "Not found";

                retObj.msg = notFoundFlag ? "Sorry, nothing found..." : null;
                retObj.results = notFoundFlag ? null : results;

                res.json(retObj);
            });
        }
    }
};