(function () {
    angular
        .module("pp")
        .controller("loginController", loginController);

    function loginController(sharedService, userService) {
        var vm = this;

        vm.login = login;

        (function init() {
            _fetchTemplates();
            _initHeaderFooter();
            _loadContent();
        })();

        function login(user) {
            userService
                .login(user)
                .then(function (res) {
                    if (res.msg) {
                        vm.errorMsg = res.msg;
                    }
                    else {
                        userService.navToProfile();
                    }
                });
        }

        function _fetchTemplates() {
            vm.templates = sharedService.getTemplates();
        }

        function _initHeaderFooter() {
            vm.navHeader = {
                leftLink: {href: "#!", iconClass: "glyphicon-home", name: "Home"},
                name: "Login",
                rightLink: {href: "#!/register", iconClass: "glyphicon-edit", name: "Register"}
            };
        }

        function _loadContent() {
            // TODO: hack; if back on login page, log out
            userService.unAuthenticate();
        }
    }
})();