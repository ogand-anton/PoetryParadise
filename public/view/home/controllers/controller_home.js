(function(){
    angular
        .module("pp")
        .controller("homeController", homeController);

    function homeController(homeService){
        var vm = this;

        vm.test = test;

        function test(){
            homeService.search(_searchCb);
        }

        function _searchCb(rs) {
            console.log("Server responded");
            console.log(rs);
            vm.successMsg = rs.data;
        }
    }
})();