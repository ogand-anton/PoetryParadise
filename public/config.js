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
    }
})();