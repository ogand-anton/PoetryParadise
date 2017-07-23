(function(){
    angular
        .module("pp")
        .controller("homeController", homeController);

    function homeController(homeService){
        var vm = this;
        vm.quantity = 10;

        vm.search = search;

        function search(searchInfo){
            var searchCb = function(rs) {
                vm.results = JSON.parse(rs.data);
                vm.successMsg = "Done";
            };

            vm.successMsg = "Searching...";
            homeService.search(searchInfo, searchCb);
        }
    }
})();