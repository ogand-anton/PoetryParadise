(function () {
    angular
        .module("pp")
        .controller("landingController", landingController);

    // TODO need to break up landing for poem and landing for collection as two different things
    function landingController($routeParams, sharedService, searchService) {
        var vm = this,
            author, title;

        (function init() {
            _parseRouteParams();
            _fetchTemplates();
            _initHeaderFooter();
            _loadContent();
        })();

        function _loadContent() {
            vm.successMsg = "Loading...";

            searchService
                .search({author: author, title: title})
                .then(function (res) {
                    vm.results = res.results;
                    vm.successMsg = res.msg;
                });
        }

        function _fetchTemplates(){
            vm.templates = Object.assign(
                sharedService.getTemplates(),
                searchService.getTemplates()
            );        }

        function _initHeaderFooter() {
            vm.navHeader = {
                leftLink: {href: "#!/search", iconClass: "glyphicon-search", name: "Search"},
                name: "Result" // TODO how to handle page title here? Poem title?
            };
        }

        function _parseRouteParams() {
            author = $routeParams["author"];
            title = $routeParams["title"];
        }
    }
})();