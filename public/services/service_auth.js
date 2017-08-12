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
            return $http
                .get("/api/authenticated")
                .then(function (res) {
                    return res.data;
                })
                .then(function (user) {
                    return user !== "0" ? user : undefined;
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