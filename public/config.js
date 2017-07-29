(function() {
    angular
        .module("pp")
        .config(configure);

    function configure($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "views/home/templates/template_home.html",
                controller: "homeController",
                controllerAs: "model"
            })
            .when("/login", {
                templateUrl: "views/user/templates/template_login.html",
                controller: "loginController",
                controllerAs: "model"
            })
            .when("/register", {
                templateUrl: "views/user/templates/template_register.html",
                controller: "registerController",
                controllerAs: "model"
            })
            .when("/user/:uid", {
                templateUrl: "views/user/templates/template_profile.html",
                controller: "profileController",
                controllerAs: "model"
            })
            .when("/search", {
                templateUrl: "views/search/templates/template_search.html",
                controller: "searchController",
                controllerAs: "model"
            })
            .when("/search/:author", {
                templateUrl: "views/search/templates/template_landing.html",
                controller: "landingAuthorController",
                controllerAs: "model"
            })
            .when("/search/:author/:title", {
                templateUrl: "views/search/templates/template_landing.html",
                controller: "landingPoemController",
                controllerAs: "model"
            })
    }
})();