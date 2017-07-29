(function () {
    angular
        .module("pp")
        .factory("searchService", searchService);

    function searchService($http) {
        var templates = {
            resultListGroup: "views/search/templates/template_result_list_group.html"
        };

        return {
            getTemplates: getTemplates,
            search: search
        };

        function getTemplates() {
            return templates;
        }

        function search(searchInfo) {
            var terms = ["author", "title", "lines"],
                queryParams = {};

            // encode each search field
            for (var i = 0; i < terms.length; i++) {
                var term = terms[i];
                if (searchInfo && searchInfo[term]) {
                    queryParams[term] = encodeURI(searchInfo[term]);
                }
            }

            return $http({
                url: "/api/search",
                method: "GET",
                params: queryParams
            }).then(function (res) {
                return res.data;
            });
        }
    }
})();