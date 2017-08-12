(function () {
    angular
        .module("pp")
        .controller("loginController", loginController);

    function loginController(sharedService, authService, userService) {
        var vm = this;

        vm.login = login;
        vm.loginGoogle = loginGoogle;

        (function init() {
            _fetchTemplates();
            _initHeaderFooter();
            _loadContent();
        })();

        function login(user) {
            authService
                .login(user)
                .then(function (res) {
                    if (res.msg) {
                        vm.errorMsg = res.msg;
                    }
                    else {
                        userService.navToProfile();
                    }
                })
                .catch(function (err) {
                    vm.errorMsg = err.statusText;
                });
        }

        function loginGoogle() {
            authService
                .loginGoogle()
                .then(function (res) {
                    if (res.msg) {
                        vm.errorMsg = res.msg;
                    }
                    else {
                        userService.navToProfile();
                    }
                })
                .catch(function (err) {
                    vm.errorMsg = err.statusText;
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