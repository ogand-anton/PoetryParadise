(function(){
    angular
        .module("pp")
        .controller("landingController", landingController);

    // TODO need convery that a landign can be for a poem and for a collection of poems
    function landingController($routeParams, homeService){
        var vm = this,
            author, title, linecount; // betting on this is a unique n-tuple although no guarantees...

        (function init(){
            author = $routeParams["author"];
            title = $routeParams["title"];
            linecount = $routeParams["linecount"];

            _load();
        })();

        function _load(){
            var searchInfo = {author: author, title: title, linecount: linecount };

            var searchCb = function(rs) {
                try {
                    vm.results = JSON.parse(rs.data);
                    vm.successMsg = null;
                } catch (ex) {
                    vm.successMsg = rs.data;
                }
            };

            vm.successMsg = "Loading...";
            homeService.search(searchInfo, searchCb);
        }
    }
})();