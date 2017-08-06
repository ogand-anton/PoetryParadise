(function () {
    angular
        .module("pp")
        .controller("profileController", profileController);

    function profileController(poemService, sharedService, userService) {
        var vm = this,
            uid;

        vm.unFavoritePoem = unFavoritePoem;
        vm.saveUser = saveUser;

        (function init() {
            uid = userService.authenticate();

            _parseRouteParams();
            _fetchTemplates();
            _initHeaderFooter();
            _loadContent();
        })();

        function unFavoritePoem(favoriteId){
            poemService
                .unFavoritePoem(uid, favoriteId)
                .then(function () {
                    _findFavoritesByUser();
                })
        }

        function saveUser() {
            userService
                .updateUser(uid, vm.profile)
                .then(function (res) {
                    vm.errorMsg = res.msg;
                    vm.successMsg = res.msg ? null : "Profile Updated";
                });
        }

        function _fetchTemplates() {
            vm.templates = sharedService.getTemplates();
        }

        function _findFavoritesByUser() {
            poemService
                .findFavoritesByUser(uid)
                .then(function (res) {
                    vm.favorites = res.favorites;
                })
        }

        function _initHeaderFooter() {
            vm.navHeader = {
                leftLink: {href: "#!/login", iconClass: "glyphicon-log-out", name: "Logout"},
                name: "Profile",
                rightLink: {
                    clickCb: saveUser,
                    href: "javacript:void(0)",
                    iconClass: "glyphicon-floppy-save",
                    name: "Save"
                }
            };
        }

        function _loadContent() {
            userService
                .findUserById(uid)
                .then(function (res) {
                    vm.errorMsg = res.msg;
                    vm.profile = res.user;
                });

            _findFavoritesByUser();
        }

        function _parseRouteParams() {
            // TODO: if userid specified and logged in, search for another user's profile to view
            // uid = $routeParams["uid"];
            // vm.uid = uid;
        }
    }
})();