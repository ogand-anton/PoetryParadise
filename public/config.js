(function() {
    angular
        .module("pp")
        .config(configure);

    function configure($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "views/search/templates/template_search.html",
                controller: "searchController",
                controllerAs: "model"
            })
            .when("/:author", {
                templateUrl: "views/search/templates/template_landing.html",
                controller: "landingController",
                controllerAs: "model"
            })
            .when("/:author/:title", {
                templateUrl: "views/search/templates/template_landing.html",
                controller: "landingController",
                controllerAs: "model"
            })
    }
})();