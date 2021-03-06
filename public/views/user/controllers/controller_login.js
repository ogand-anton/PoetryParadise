(function () {
    angular
        .module("pp")
        .controller("loginController", loginController);

    function loginController(authService, sharedService) {
        var vm = this;

        vm.login = login;

        (function init() {
            _fetchTemplates();
            _initHeaderFooter();
            _loadContent();
        })();

        function login(user) {
            vm.successMsg = "Logging in...";
            vm.errorMsg = undefined;

            authService
                .login(user)
                .then(function (res) {
                    if (res.msg) {
                        vm.errorMsg = res.msg;
                        vm.successMsg = undefined;
                    }
                    else {
                        authService.referBack();
                    }
                })
                .catch(function (err) {
                    vm.errorMsg = err.statusText;
                    vm.successMsg = undefined;
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
            var cookiesEnabled = sharedService.testCookies();
            vm.errorMsg = cookiesEnabled ? null : "Please allow cookies to login";
        }
    }
})();