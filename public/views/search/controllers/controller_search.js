(function () {
    angular
        .module("pp")
        .controller("searchController", searchController);

    function searchController($location, searchService) {
        var vm = this;

        vm.search = search;
        vm.goToLanding = goToLanding;

        (function init() {
            _fetchTemplates();
            _loadContent();
        })();

        function search(searchInfo) {
            vm.successMsg = "Searching...";

            searchService
                .search(searchInfo)
                .then(function (res) {
                    vm.results = res.results;
                    vm.successMsg = res.msg; // TODO need separate message property for errors
                });
        }

        function goToLanding(poemInfo) {
            $location.url("/" + poemInfo.author + "/" + poemInfo.title);
        }

        function _fetchTemplates() {
            vm.templates = searchService.getTemplates();
        }

        function _loadContent() {
            vm.maxQuantity = 10;
        }
    }
})();