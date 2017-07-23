module.exports = function(app)
{
    var http = require("http");

    app.get("/api/search", search);

    function search(rq, rs) {
        var options = {host: "poetrydb.org"};
        var inputs  = [],
            searchTerms = [];

        if (rq.query.author) {
            inputs.push("author");
            searchTerms.push(rq.query.author);
        }
        if (rq.query.title) {
            inputs.push("title");
            searchTerms.push(rq.query.title);
        }
        if (rq.query.lines) {
            inputs.push("lines");
            searchTerms.push(rq.query.lines);
        }
        if (rq.query.linecount) {
            inputs.push("linecount");
            searchTerms.push(rq.query.linecount);
        }

        if (inputs.length && searchTerms.length) {
            // path needs to be constructed as follows:
            //  /<in>[,in]/<sch>[;sch][:abs]/<out>[,out][format]
            //  in: author, title, lines, linecount
            //  sch: string corresponding to in fields (MUST be equal to in size)
            //      [:abs] absolute matching, not just substring
            //  out: author, title, lines, linecount, all/null
            //  format: .json/null, .txt
            options.path = "/" + inputs.join(",") + "/" + searchTerms.join(";") + "/all.json";
            http.request(options, _genCallback(rs)).end();
        } else {
            rs.json("No search criteria specified");
        }
    }

    function _genCallback(clientRs) {
        var str = "";

        function cb(dbRs) {
            //another chunk of data has been received
            dbRs.on("data", function (chunk) { str += chunk; });

            //the whole response has been received
            dbRs.on("end", function () { clientRs.json(str) });
        }

        return cb;
    }
};