(function () {
    angular
        .module("pp")
        .controller("homeController", homeController);

    function homeController(sharedService) {
        var vm = this;

        (function init() {
            _fetchTemplates();
            _initHeaderFooter();
        })();

        function _fetchTemplates() {
            vm.templates = sharedService.getTemplates();
        }

        function _initHeaderFooter() {
            vm.navHeader = {
                leftLink: {href: "../test", iconClass: "glyphicon-tower", name: "Mongo"},
                name: "Poetry Paradise",
                rightLink: {href: "#!/profile", iconClass: "glyphicon-user", name: "Profile"}
            };
        }
    }
})();