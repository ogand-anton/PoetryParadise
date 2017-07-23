(function() {
    angular
        .module("pp")
        .config(configure);

    function configure($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "view/home/templates/template_home.html",
                controller: "homeController",
                controllerAs: "model"
            })
            .when("/:author", {
                templateUrl: "view/home/templates/template_landing.html",
                controller: "landingController",
                controllerAs: "model"
            })
            .when("/:author/:title", {
                templateUrl: "view/home/templates/template_landing.html",
                controller: "landingController",
                controllerAs: "model"
            })
    }
})();