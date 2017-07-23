(function(){
    angular
        .module("pp")
        .factory("homeService", homeService);

    function homeService($http) {
        return {
            "search": search
        };

        function search(searchInfo, successCb, errorCb) {
            var terms = ["author", "title", "lines", "linecount"],
                queryParams = {};

            for (var i = 0; i < terms.length; i++){
                var term = terms[i];
                if (searchInfo && searchInfo[term]) {
                    queryParams[term] = encodeURI(searchInfo[term]);
                }
            }

            var req = {
                url: "/api/search",
                method: "GET",
                params: queryParams
            };

            $http(req).then(successCb || _successCb, errorCb || _errorCb);
        }

        function _successCb(res) {
            console.log(res);
        }

        function _errorCb(err) {
            console.log(err);
        }
    }
})();