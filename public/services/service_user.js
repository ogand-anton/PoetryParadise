(function (cookies) {
    angular
        .module("pp")
        .factory("userService", userService);

    function userService($location, $http) {
        return {
            authenticate: authenticate,
            createUser: createUser,
            deleteUser: deleteUser,
            login: login,
            findUserById: findUserById,
            findUserByUsername: findUserByUsername,
            getNavRightLink: getNavRightLink,
            navToProfile: navToProfile,
            unAuthenticate: unAuthenticate,
            updateUser: updateUser
        };

        // returns logged in user id
        // if not, redirects to login page
        function authenticate(preventRedirectFlag) {
            var userId  = cookies.get("userId");
            if (userId) {
                return userId;
            } else if (!preventRedirectFlag) {
                $location.url("/login");
            }
        }

        function createUser(user) {
            return $http({
                url: "/api/user",
                method: "POST",
                params: user
            }).then(function (res) {
                _rememberUser(res);
                return res.data;
            });
        }

        function deleteUser(userId) {
            return $http({
                url: "/api/user/" + userId,
                method: "DELETE"
            }).then(function (res) {
                return res.data;
            });
        }

        function getNavRightLink(){
            return authenticate(true) ? // check if logged in without redirecting
                {href: "#!/profile", iconClass: "glyphicon-user", name: "Profile"} :
                {href: "#!/login", iconClass: "glyphicon-log-in", name: "Login"};
        }

        function findUserById(userId) {
            return $http({
                url: "/api/user/" + userId,
                method: "GET"
            }).then(function (res) {
                return res.data;
            });
        }

        function findUserByUsername(username) {
            return $http({
                url: "/api/user",
                method: "GET",
                params: {username: username}
            }).then(function (res) {
                return res.data;
            });
        }

        // TODO need mechanism to redirect to previous page on login
        function login(loginCredentials) {
            return $http({
                url: "/api/login",
                method: "GET",
                params: loginCredentials
            }).then(function (res) {
                _rememberUser(res);
                return res.data;
            });
        }

        function navToProfile() {
            $location.url("/profile");
        }

        // logs a user out
        function unAuthenticate() {
            cookies.remove("userId");
        }

        function updateUser(userId, user) {
            return $http({
                url: "/api/user/" + userId,
                method: "PUT",
                params: user
            }).then(function (res) {
                return res.data;
            });
        }

        function _rememberUser(res) {
            cookies.set("userId", res.data && res.data.user && res.data.user._id);
        }
    }
})(Cookies); // TODO: figure out the right way to use globals in angular