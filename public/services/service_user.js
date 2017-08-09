(function () {
    angular
        .module("pp")
        .factory("userService", userService);

    function userService($location, $http) {
        return {
            createUser: createUser,
            deleteUser: deleteUser,
            findFollowers: findFollowers,
            findUserById: findUserById,
            findUserByUsername: findUserByUsername,
            findUserFollowers: findUserFollowers,
            followUser: followUser,
            navToProfile: navToProfile,
            unFollowUser: unFollowUser,
            updateUser: updateUser
        };

        function createUser(user) {
            return $http({
                url: "/api/user",
                method: "POST",
                params: user
            }).then(function (res) {
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
            return $http({
                url: "/api/user/" + userId,
                method: "PUT",
                params: user
            }).then(function (res) {
                return res.data;
            });
        }
    }
})();