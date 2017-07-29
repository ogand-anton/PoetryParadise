(function () {
    angular
        .module("pp")
        .controller("searchController", searchController);

    function searchController($location, sharedService, searchService) {
        var vm = this;

        vm.search = search;
        vm.goToLanding = goToLanding;

        (function init() {
            _fetchTemplates();
            _initHeaderFooter();
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
            $location.url("/search/" + poemInfo.author + "/" + poemInfo.title);
        }

        function _fetchTemplates() {
            vm.templates = Object.assign(
                sharedService.getTemplates(),
                searchService.getTemplates()
            );
        }

        function _initHeaderFooter() {
            vm.navHeader = {
                leftLink: {href: "#!", iconClass: "glyphicon-home", name: "Home"},
                name: "Search"
            };
        }

        function _loadContent() {
            vm.maxQuantity = 10;
        }
    }
})();