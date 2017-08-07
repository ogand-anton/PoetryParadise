(function (cookies) {
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
            .when("/profile", {
                templateUrl: "views/user/templates/template_profile.html",
                controller: "profileController",
                controllerAs: "model",
                resolve: {loggedIn: _checkLoggedIn} // TODO protect everything else that is needed to be protected
            })
            .when("/profile/:uid", {
                templateUrl: "views/user/templates/template_profile_other.html",
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
            });

        // TODO find a better place for this
        function _checkLoggedIn($q, $timeout, $http, $location, $rootScope) {
            var deferred = $q.defer();
            $http
                .get("/api/loggedIn")
                .then(function(res){
                    return res.data;
                })
                .then(function (user) {
                    $rootScope.errorMessage = null;
                    if (user !== "0") {
                        cookies.set("userId", user._id);
                        deferred.resolve(user);
                    } else {
                        cookies.remove("userId");
                        deferred.reject();
                        $location.url("#!/login");
                    }
                });
            return deferred.promise;
        }
    }
})(Cookies);