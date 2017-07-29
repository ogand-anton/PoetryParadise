(function () {
    angular
        .module("pp")
        .controller("landingPoemController", landingPoemController);

    function landingPoemController($routeParams, searchService, sharedService, userService) {
        var vm = this,
            author, title;

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
                name: "Poem Result",
                rightLink: userService.getNavRightLink()
            };
        }

        function _loadContent() {
            vm.successMsg = "Loading...";

            searchService
                .search({author: author, title: title})
                .then(function (res) {
                    vm.results = res.results;
                    vm.successMsg = res.msg;
                });
        }

        function _parseRouteParams() {
            author = $routeParams["author"];
            title = $routeParams["title"];
        }
    }
})();