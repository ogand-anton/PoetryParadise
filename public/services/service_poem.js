(function () {
    angular
        .module("pp")
        .factory("poemService", poemService);

    function poemService($http) {
        return {
            favoritePoem: favoritePoem
        };

        function favoritePoem(userId, poem) {
            return;
        }
    }
})();