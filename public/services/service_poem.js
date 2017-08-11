(function () {
    angular
        .module("pp")
        .factory("poemService", poemService);

    function poemService($http) {
        return {
            deletePoem: deletePoem,
            favoritePoem: favoritePoem,
            findFavoriteUsers: findFavoriteUsers,
            findFavoritesByUser: findFavoritesByUser,
            findPoem: findPoem,
            findPoems: findPoems,
            savePoem: savePoem,
            unFavoritePoem: unFavoritePoem
        };

        function deletePoem(poemId) {
            return $http({
                url: "/api/poem",
                method: "DELETE",
                params: {poemId: poemId}
            }).then(function (res) {
                return res.data;
            });
        }

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
            return $http({
                url: "/api/poem",
                method: "GET",
                params: {poemId: poemId}
            }).then(function (res) {
                return res.data;
            });
        }

        function findPoems(userId) {
            return $http({
                url: "/api/poems",
                method: "GET",
                params: userId ? {userId: userId} : undefined
            }).then(function (res) {
                return res.data;
            });
        }

        function savePoem(poemId, poem) {
            if (poemId) {
                return $http
                    .put("/api/poem", {poemId: poemId, poem: poem})
                    .then(function (res) {
                        return res.data;
                    });
            } else {
                return $http
                    .post("/api/poem", {poem: poem})
                    .then(function (res) {
                        return res.data;
                    });
            }
        }

        function unFavoritePoem(userId, favoriteId) {
            return $http({
                url: "/api/poem/" + userId,
                method: "DELETE",
                params: {favoriteId: favoriteId}
            }).then(function (res) {
                return res.data;
            });
        }
    }
})();