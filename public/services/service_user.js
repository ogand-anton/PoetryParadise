(function () {
    angular
        .module("pp")
        .factory("userService", userService);

    function userService($location, $http) {
        return {
            deleteUser: deleteUser,
            findAllUsers: findAllUsers,
            findFollowers: findFollowers,
            findUserById: findUserById,
            findUserByUsername: findUserByUsername,
            findUserFollowers: findUserFollowers,
            followUser: followUser,
            unFollowUser: unFollowUser,
            updateUser: updateUser
        };

        function deleteUser(userId) {
            return $http({
                url: "/api/user/",
                method: "DELETE",
                params: {userId: userId}
            }).then(function (res) {
                return res.data;
            });
        }

        function findAllUsers() {
            return $http({
                url: "/api/users",
                method: "GET"
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
            return $http
                .post("/api/user/follow", {userId: userId, followerId: followerId})
                .then(function (res) {
                    return res.data;
                });
        }

        function navToProfile() {
            $location.url("/profile");
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
            return $http
                .put("/api/user/" + userId, {user: user})
                .then(function (res) {
                    return res.data;
                });
        }
    }
})();