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
            var rightLink = uid ?
                {href: "#!/profile", iconClass: "glyphicon-user", name: "Profile"} :
                {href: "#!/login", iconClass: "glyphicon-log-in", name: "Login"};

            vm.navHeader = {
                leftLink: {href: "../test/index.html", iconClass: "glyphicon-tower", name: "Test Mongo"},
                name: "Poetry Paradise",
                rightLink: rightLink
            };
        }
    }
})();