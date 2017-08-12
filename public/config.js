(function () {
    angular
        .module("pp")
        .config(configure);

    function configure($routeProvider) {
        $routeProvider.caseInsensitiveMatch = true;

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
            .when("/poem", {
                templateUrl: "views/poem/templates/template_poem_landing.html",
                controller: "poemEditController",
                controllerAs: "model",
                resolve: {authUser: authenticate}
            })
            .when("/poem/:poemId", {
                templateUrl: "views/poem/templates/template_poem_landing.html",
                controller: "poemEditController",
                controllerAs: "model",
                resolve: {authUser: authenticate}
            })
            .when("/poem/:poemId/review/:reviewId", {
                templateUrl: "views/review/templates/template_review_landing.html",
                controller: "reviewEditController",
                controllerAs: "model",
                resolve: {authUser: authenticate}
            })
            .when("/poem/:poemId/translation", {
                templateUrl: "views/translation/templates/template_translation_landing.html",
                controller: "translationEditController",
                controllerAs: "model",
                resolve: {authUser: authenticate}
            })
            .when("/poem/:poemId/translation/:translationId", {
                templateUrl: "views/translation/templates/template_translation_landing.html",
                controller: "translationEditController",
                controllerAs: "model",
                resolve: {authUser: authenticate}
            })
            .when("/profile", {
                templateUrl: "views/user/templates/template_profile.html",
                controller: "profileController",
                controllerAs: "model",
                resolve: {authUser: authenticate}
            })
            .when("/profile/:uid", {
                templateUrl: "views/user/templates/template_profile.html",
                controller: "profileController",
                controllerAs: "model",
                resolve: {authUser: authenticate}
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
            .otherwise({
                redirectTo: "/profile"
            });

        function authenticate($q, authService) {
            var authPromise = $q.defer();

            authService
                .authenticate()
                .then(function (user) {
                    if (user) {
                        authPromise.resolve(user);
                    } else {
                        authPromise.reject();
                    }
                });

            return authPromise.promise;
        }
    }
})();