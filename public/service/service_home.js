(function(){
    angular
        .module("pp")
        .factory("homeService", homeService);

    function homeService($http) {
        return {
            "search": search
        };

        function search(cb) {
            $http.get("/api/search")
                .then(
                    cb,
                    function (err) {
                        console.log(err);
                    }
                );
        }
    }
})();