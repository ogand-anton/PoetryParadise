(function () {
    angular
        .module("pp")
        .factory("poemService", poemService);

    function poemService($http) {
        return {
            favoritePoem: favoritePoem,
            findFavoriteUsers: findFavoriteUsers,
            findFavoritesByUser: findFavoritesByUser,
            findPoem: findPoem,
            savePoem: savePoem,
            unFavoritePoem: unFavoritePoem
        };

        function favoritePoem(userId, poem) {
            return $http({
                url: "/api/poem/" + userId,
                method: "PUT",
                params: {author: poem.author, title: poem.title}
            }).then(function (res) {
                return res.data;
            });
        }

        function findFavoriteUsers(poem) {
            return $http({
                url: "/api/poem/users",
                method: "GET",
                params: {author: poem.author, title: poem.title}
            }).then(function (res) {
                return res.data;
            });
        }

        function findFavoritesByUser(userId) {
            return $http({
                url: "/api/poem/" + userId,
                method: "GET"
            }).then(function (res) {
                return res.data;
            });
        }

        function findPoem(poemId) {
            return $http
                .get("/api/poem", {poemId: poemId})
                .then(function (res) {
                    return res.data;
                });
        }

        function savePoem(poemId, poem) {
            return $http
                .post("/api/poem", {poemId: poemId, poem: poem})
                .then(function (res) {
                    return res.data;
                });
        }

        function unFavoritePoem(userId, favoriteId) {
            return $http({
                url: "/api/poem/" + userId,
                method: "DELETE", // TODO hide specific http actions behind post
                params: {favoriteId: favoriteId}
            }).then(function (res) {
                return res.data;
            });
        }
    }
})();