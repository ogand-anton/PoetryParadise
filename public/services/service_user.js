(function() {
    angular
        .module("pp")
        .factory("userService", userService);

    function userService($http) {
        return {
            createUser: createUser,
            deleteUser: deleteUser,
            findUserByCredentials: findUserByCredentials,
            findUserById: findUserById,
            findUserByUsername: findUserByUsername,
            updateUser: updateUser
        };

        function createUser(user) {
            return $http({
                url: "/api/user",
                method: "POST",
                params: user
            }).then(function(res){
                return res.data;
            });
        }

        function deleteUser(userId) {
            return $http({
                url: "/api/user/" + userId,
                method: "DELETE"
            }).then(function(res){
                return res.data;
            });
        }

        function findUserByCredentials(loginCredentials) {
            return $http({
                url: "/api/login",
                method: "GET",
                params: loginCredentials
            }).then(function(res){
                return res.data;
            });
        }

        function findUserById(userId) {
            return $http({
                url: "/api/user/" + userId,
                method: "GET"
            }).then(function(res){
                return res.data;
            });
        }

        function findUserByUsername(username) {
            return $http({
                url: "/api/user",
                method: "GET",
                params: {username: username}
            }).then(function(res){
                return res.data;
            });
        }

        function updateUser(userId, user) {
            return $http({
                url: "/api/user/" + userId,
                method: "PUT",
                params: user
            }).then(function(res){
                return res.data;
            });
        }
    }
})();