(function(){
    angular
        .module("pp")
        .controller("landingController", landingController);

    // TODO need to break up landing for poem and landing for collection as two different thigns 
    function landingController($routeParams, homeService){
        var vm = this,
            author, title; // betting on this is a unique n-tuple although no guarantees...

        (function init(){
            author = $routeParams["author"];
            title = $routeParams["title"];

            _load();
        })();

        function _load(){
            var searchInfo = {author: author, title: title};

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