(function () {
    angular
        .module("pp")
        .controller("landingAuthorController", landingAuthorController);

    function landingAuthorController($routeParams, searchService, sharedService) {
        var vm = this,
            author;

        (function init() {
            _parseRouteParams();
            _fetchTemplates();
            _initHeaderFooter();
            _loadContent();
        })();

        function _fetchTemplates() {
            vm.templates = Object.assign(
                sharedService.getTemplates(),
                searchService.getTemplates()
            );
        }

        function _initHeaderFooter() {
            vm.navHeader = {
                leftLink: {href: "#!/search", iconClass: "glyphicon-search", name: "Search"},
                name: "Author Results",
                rightLink: {href: "#!/profile", iconClass: "glyphicon-user", name: "Profile"}
            };
        }

        function _loadContent() {
            vm.suppressAuthorLink = true;
            vm.maxLines = 10;
            vm.successMsg = "Loading...";

            searchService
                .search({author: author})
                .then(function (res) {
                    vm.results = res.results;
                    vm.successMsg = res.msg;
                });
        }

        function _parseRouteParams() {
            author = $routeParams["author"];
        }
    }
})();