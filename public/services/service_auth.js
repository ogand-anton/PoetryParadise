(function () {
    angular
        .module("pp")
        .factory("authService", authService);

    function authService($location, $http) {
        return {
            authenticate: authenticate,
            login: login,
            logout: logout
        };

        function authenticate(preventRedirect) {
            // TODO need mechanism to redirect to previous page on login
            // store current url
            // login
            // if stored url exists, redirect to
            return $http
                .get("/api/authenticated")
                .then(function (res) {
                    return res.data;
                })
                .then(function (user) {
                    if (user !== "0") {
                        return user;
                    } else if (!preventRedirect) {
                        $location.url("login");
                    }
                });
        }

        function login(loginCredentials) {
            return $http({
                url: "/api/login",
                method: "POST",
                params: loginCredentials
            }).then(function (res) {
                return res.data;
            });
        }

        function logout() {
            return $http({
                url: "/api/logout",
                method: "POST"
            }).then(function () {
                $location.url("login");
            });
        }
    }
})();