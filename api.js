module.exports = function(app)
{
    var http = require('http');

    //The url we want is: 'http://poetrydb.org/title/Ozymandias/lines.json'
    var options = {
        host: 'poetrydb.org',
        path: '/title/Ozymandias/lines.json'
    };

    app.get("/api/search", search);

    function search(rq, rs) {
        console.log("Request received");
        http.request(options, _genCallback(rs)).end();
    }

    function _genCallback(clientRs) {
        var str = '';

        function cb(dbRs) {
            //another chunk of data has been received, so append it to `str`
            dbRs.on('data', function (chunk) {
                str += chunk;
            });

            //the whole response has been received, so we just print it out here
            dbRs.on('end', function () {
                console.log(str);
                clientRs.json(str)
            });
        }

        return cb;
    }
};