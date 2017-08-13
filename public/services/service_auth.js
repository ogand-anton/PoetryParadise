(function (cookies) {
    angular
        .module("pp")
        .factory("authService", authService);

    function authService($location, $http) {
        return {
            authenticate: authenticate,
            createUser: createUser,
            login: login,
            logout: logout,
            referBack: referBack,
            referToLogin: referToLogin
        };

        function authenticate() {
            return $http
                .get("/api/authenticated")
                .then(function (res) {
                    return res.data;
                })
                .then(function (user) {
                    return user !== "0" ? user : undefined;
                });
        }

        function createUser(user) {
            return $http
                .post("/api/register", {user: user})
                .then(function (res) {
                    return res.data;
                });
        }

        function login(loginCredentials) {
            return $http
                .post("/api/login", loginCredentials)
                .then(function (res) {
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

        function referBack() {
            var referrerUrl = cookies.get("referrerUrl");
            cookies.remove("referrerUrl");
            $location.url(referrerUrl || "profile");
        }

        function referToLogin() {
            cookies.set("referrerUrl", $location.$$url);
            $location.url("login");
        }
    }
})(Cookies);