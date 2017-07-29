(function() {
    angular
        .module("pp")
        .controller("registerController", registerController);

    function registerController($location, sharedService, userService) {
        var vm = this;

        vm.registerUser = registerUser;

        (function init() {
            _fetchTemplates();
            _initHeaderFooter();
        })();

        function registerUser(userInfo) {
            userService
                .createUser(userInfo || {})
                .then(function(res){
                    if (res.msg) {
                        vm.errorMsg = res.msg;
                    } else {
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
                name: "Register",
                rightLink: {href: "#!/login", iconClass: "glyphicon-log-in", name: "Login"}
            };
        }
    }
})();