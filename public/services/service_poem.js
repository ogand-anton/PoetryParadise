(function () {
    angular
        .module("pp")
        .factory("poemService", poemService);

    function poemService($http) {
        return {
            favoritePoem: favoritePoem,
            findFavoritesByUser: findFavoritesByUser,
            unFavoritePoem: unFavoritePoem
        };

        function favoritePoem(userId, poem) {
            return $http({
                url: "/api/poem/" + userId,
                method: "PUT",
                params: {author: poem.author, title: poem.title}
            }).then(function(res){
               return res.data;
            });
        }

        function findFavoritesByUser(userId){
            return $http({
                url: "/api/poem/" + userId,
                method: "GET"
            }).then(function (res) {
                return res.data;
            });
        }

        function unFavoritePoem(userId, favoriteId){
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