(function () {
    angular
        .module("pp")
        .controller("searchController", searchController);

    function searchController(searchService, sharedService) {
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
                    vm.successMsg = res.msg;
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
                name: "Search",
                rightLink: {href: "#!/profile", iconClass: "glyphicon-user", name: "Profile"}
            };
        }

        function _loadContent() {
            vm.maxLines = 10;
        }
    }
})();