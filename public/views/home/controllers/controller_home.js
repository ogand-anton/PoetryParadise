(function () {
    angular
        .module("pp")
        .controller("homeController", homeController);

    function homeController(sharedService, userService) {
        var vm = this,
            uid;

        (function init() {
            uid = userService.authenticate(true);

            _fetchTemplates();
            _initHeaderFooter();
        })();

        function _fetchTemplates() {
            vm.templates = sharedService.getTemplates();
        }

        function _initHeaderFooter() {
            vm.navHeader = {
                leftLink: {href: "../test/index.html", iconClass: "glyphicon-tower", name: "Test Mongo"},
                name: "Poetry Paradise",
                rightLink: userService.getNavRightLink()
            };
        }
    }
})();