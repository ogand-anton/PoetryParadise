(function () {
    angular
        .module("pp")
        .controller("adminController", adminController);

    function adminController(authService, sharedService, userService) {
        var vm = this;

        vm.createUser = createUser;
        vm.deleteUser = deleteUser;
        vm.updateUser = updateUser;

        (function init() {
            _fetchTemplates();
            _initHeaderFooter();
            _loadContent();
        })();

        function createUser(user) {
            authService
                .createUser(user, true)
                .then(function (res) {
                    vm.errorMsg = res.msg;
                    vm.successMsg = res.msg ? undefined : "User created";
                    _findUsers();
                })
        }

        function deleteUser(user) {
            userService
                .deleteUser(user._id)
                .then(function () {
                    _findUsers();
                });
        }

        function updateUser(user) {
            userService
                .updateUser(user._id, user)
                .then(function (res) {
                    vm.errorMsg = res.msg;
                    vm.successMsg = res.msg ? undefined : "User updated";
                    _findUsers();
                })
        }

        function _fetchTemplates() {
            vm.templates = sharedService.getTemplates();
        }

        function _findUsers() {
            userService
                .findAllUsers()
                .then(function (users) {
                    vm.users = users;
                });
        }

        function _initHeaderFooter() {
            vm.navHeader = {
                leftLink: {href: "/", iconClass: "glyphicon-home", name: "Home"},
                name: "Admin Console",
                rightLink: {href: "#!/profile", iconClass: "glyphicon-user", name: "Profile"}
            };
        }

        function _loadContent() {
            _findUsers();
        }
    }
})();