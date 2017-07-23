(function(){
    angular
        .module("pp")
        .controller("homeController", homeController);

    function homeController($location, homeService){
        var vm = this;
        vm.quantity = 10;

        vm.search = search;
        vm.goToLanding = goToLanding;

        function search(searchInfo){
            var searchCb = function(rs) {
                try {
                    vm.results = JSON.parse(rs.data);

                    if (!vm.results.status) {
                        vm.successMsg = null;
                    } else {
                        vm.successMsg = "Not found...";
                        vm.results = null;
                    }
                } catch (ex) {
                    vm.results = null;
                    vm.successMsg = rs.data;
                }
            };

            vm.successMsg = "Searching...";
            homeService.search(searchInfo, searchCb);
        }

        function goToLanding(poemInfo){
            // TODO: parenthesis handling
            $location.url("/" + poemInfo.author + "/" + poemInfo.title.replace("(", "%5C("));
        }
    }
})();