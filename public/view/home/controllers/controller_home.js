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
                    vm.successMsg = null;
                } catch (ex) {
                    vm.successMsg = rs.data;
                }
            };

            vm.successMsg = "Searching...";
            homeService.search(searchInfo, searchCb);
        }

        function goToLanding(poemInfo){
            $location.url("/" + poemInfo.author + "/" + poemInfo.title + "/" + poemInfo.linecount);
        }
    }
})();