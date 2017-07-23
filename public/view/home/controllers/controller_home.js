(function(){
    angular
        .module("pp")
        .controller("homeController", homeController);

    function homeController(homeService){
        var vm = this;

        vm.search = search;

        function search(searchInfo){
            var searchCb = function(rs) {
                vm.successMsg = rs.data;
            };

            vm.successMsg = "Searching...";
            homeService.search(searchInfo, searchCb);
        }
    }
})();