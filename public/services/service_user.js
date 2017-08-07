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
            findFollowers: findFollowers,
            findUserById: findUserById,
            findUserByUsername: findUserByUsername,
            findUserFollowers: findUserFollowers,
            followUser: followUser,
            getNavRightLink: getNavRightLink,
            navToProfile: navToProfile,
            unAuthenticate: unAuthenticate,
            unFollowUser: unFollowUser,
            updateUser: updateUser
        };

        // TODO checking for authentication should belong on server and checked at every request
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
                url: "/api/user/" + userId + "/delete",
                method: "DELETE"
            }).then(function (res) {
                return res.data;
            });
        }

        function findFollowers(userId) {
            return $http({
                url: "/api/user/followers",
                method: "GET",
                params: {userId: userId}
            }).then(function (res) {
                return res.data;
            });
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

        function findUserFollowers(userId) {
            return $http({
                url: "/api/user/" + userId + "/followers",
                method: "GET"
            }).then(function (res) {
                return res.data;
            });
        }

        function followUser(userId, followerId) {
            return $http({
                url: "/api/user/follow",
                method: "POST",
                params: {userId: userId, followerId: followerId}
            }).then(function (res) {
                return res.data;
            });
        }

        function getNavRightLink() {
            return authenticate(true) ? // check if logged in without redirecting
                {href: "#!/profile", iconClass: "glyphicon-user", name: "Profile"} :
                {href: "#!/login", iconClass: "glyphicon-log-in", name: "Login"};
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

        function unFollowUser(userId, followerId) {
            return $http({
                url: "/api/user/unfollow",
                method: "DELETE",
                params: {userId: userId, followerId: followerId}
            }).then(function (res) {
                return res.data;
            });
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