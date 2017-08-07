(function () {
    angular
        .module("pp")
        .controller("profileController", profileController);

    function profileController($routeParams, poemService, sharedService, userService) {
        var vm = this,
            uid,
            authenticatedUid,
            readOnlyFlag;

        vm.followUser = followUser;
        vm.saveUser = saveUser;
        vm.unFavoritePoem = unFavoritePoem;
        vm.unFollowUser = unFollowUser;

        (function init() {
            authenticatedUid = userService.authenticate();
            uid = authenticatedUid;

            _parseRouteParams();
            _fetchTemplates();
            _initHeaderFooter();
            _loadContent();
        })();

        function followUser() {
            // TODO prevent following (a) yourself and (b) someone else multiple times
            userService
                .followUser(authenticatedUid, uid)
                .then(function(){
                    _findFollowers();
                });
        }

        function saveUser() {
            userService
                .updateUser(uid, vm.profile)
                .then(function (res) {
                    vm.errorMsg = res.msg;
                    vm.successMsg = res.msg ? null : "Profile Updated";
                });
        }

        function unFavoritePoem(favoriteId) {
            poemService
                .unFavoritePoem(uid, favoriteId)
                .then(function () {
                    _findFavoritesByUser();
                })
        }

        function unFollowUser(followerId) {
            userService
                .unFollowUser(authenticatedUid, followerId)
                .then(function() {
                   _findFollowers();
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

        function _findFollowers() {
            if (uid !== authenticatedUid) { // read only profile
                userService
                    .findUserFollowers(uid)
                    .then(function(followers){
                       vm.followers = followers;
                    });
            } else { // your actual profile
                userService
                    .findFollowers(uid)
                    .then(function (followers) {
                        vm.followers = followers;
                    });
            }
        }

        function _initHeaderFooter() {
            var saveUserNav = {
                    clickCb: saveUser,
                    href: "javacript:void(0)",
                    iconClass: "glyphicon-floppy-save",
                    name: "Save"
                },
                followNav = {
                    clickCb: followUser,
                    href: "javacript:void(0)",
                    iconClass: "glyphicon-thumbs-up",
                    name: "Follow"
                };

            vm.navHeader = {
                leftLink: {href: "#!/login", iconClass: "glyphicon-log-out", name: "Logout"},
                name: "Profile",
                rightLink: readOnlyFlag ? followNav : saveUserNav
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
            _findFollowers();
        }

        function _parseRouteParams() {
            // TODO: deal with either seeing your own account in read only mode doing something about it
            if ($routeParams["uid"]) {
                uid = $routeParams["uid"];
                readOnlyFlag = true;
                vm.uid = uid;
            }
        }
    }
})();