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
            .when("/admin", {
                templateUrl: "views/home/templates/template_admin_profile.html",
                controller: "adminController",
                controllerAs: "model",
                resolve: {authUser: genAuthenticateCb()}
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
                resolve: {authUser: genAuthenticateCb()}
            })
            .when("/poem/:poemId", {
                templateUrl: "views/poem/templates/template_poem_landing.html",
                controller: "poemEditController",
                controllerAs: "model",
                resolve: {authUser: genAuthenticateCb()}
            })
            .when("/poem/:poemId/review/:reviewId", {
                templateUrl: "views/review/templates/template_review_landing.html",
                controller: "reviewEditController",
                controllerAs: "model",
                resolve: {authUser: genAuthenticateCb()}
            })
            .when("/poem/:poemId/translation", {
                templateUrl: "views/translation/templates/template_translation_landing.html",
                controller: "translationEditController",
                controllerAs: "model",
                resolve: {authUser: genAuthenticateCb()}
            })
            .when("/poem/:poemId/translation/:translationId", {
                templateUrl: "views/translation/templates/template_translation_landing.html",
                controller: "translationEditController",
                controllerAs: "model",
                resolve: {authUser: genAuthenticateCb()}
            })
            .when("/profile", {
                templateUrl: "views/user/templates/template_profile.html",
                controller: "profileController",
                controllerAs: "model",
                resolve: {authUser: genAuthenticateCb()}
            })
            .when("/profile/:uid", {
                templateUrl: "views/user/templates/template_profile.html",
                controller: "profileController",
                controllerAs: "model",
                resolve: {authUser: genAuthenticateCb()}
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
                controllerAs: "model",
                resolve: {authUser: genAuthenticateCb(false)}
            })
            .otherwise({
                redirectTo: "/profile"
            });
    }

    function genAuthenticateCb(redirectFlag) {
        return function ($q, authService) {
            var authPromise = $q.defer();

            authService
                .authenticate()
                .then(function (user) {
                    if (user || redirectFlag === false) {
                        authPromise.resolve(user);
                    } else {
                        authPromise.reject();
                        authService.referToLogin();
                    }
                });

            return authPromise.promise;
        }
    }
})();