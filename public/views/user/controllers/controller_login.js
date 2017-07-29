(function() {
    angular
        .module("pp")
        .controller("loginController", loginController);

    function loginController($location, sharedService, userService) {
        var vm = this;

        vm.login = login;

        (function init() {
            _fetchTemplates();
            _initHeaderFooter();
        })();

        function login(loginInfo) {
            userService
                .findUserByCredentials(loginInfo)
                .then(function(res){
                    if (res.msg) {
                        vm.errorMsg = res.msg;
                    }
                    else {
                        $location.url("/user/" + res.user._id);
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
    }
})();