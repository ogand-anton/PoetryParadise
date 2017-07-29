(function () {
    angular
        .module("pp")
        .controller("searchController", searchController);

    function searchController(sharedService, searchService) {
        var vm = this;

        vm.search = search;

        (function init() {
            _fetchTemplates();
            _initHeaderFooter();
            _loadContent();
        })();

        function search(search) {
            vm.successMsg = "Searching...";

            searchService
                .search(search)
                .then(function (res) {
                    vm.results = res.results;
                    vm.successMsg = res.msg; // TODO need separate message property for errors
                });
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
            vm.maxLines = 10;
        }
    }
})();