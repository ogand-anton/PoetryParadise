(function () {
    angular
        .module("pp")
        .controller("profileController", profileController);

    function profileController($routeParams, $location, authService, poemService, sharedService, userService) {
        var vm = this,
            uid,
            authenticatedUid,
            readOnlyFlag;

        vm.followUser = followUser;
        vm.saveUser = saveUser;
        vm.logout = logout;
        vm.unFavoritePoem = unFavoritePoem;
        vm.unFollowUser = unFollowUser;

        // TODO make this delayed load prettier and put it back into config.js
        function init() {
            _parseRouteParams();
            _fetchTemplates();
            _initHeaderFooter();
            _loadContent();
        }

        authService
            .authenticate()
            .then(function (user) {
                if (user) {
                    authenticatedUid = user._id;
                    uid = authenticatedUid;
                    init();
                } else {
                    $location.url("login"); // todo move to service
                }
            });

        function followUser() {
            // TODO prevent following (a) yourself and (b) someone else multiple times
            userService
                .followUser(authenticatedUid, uid)
                .then(function () {
                    _findFollowers();
                });
        }

        function logout() {
            authService.logout();
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
                .then(function () {
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
                    .then(function (followers) {
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

        function _findPoems() {
            poemService
                .findPoems(uid !== authenticatedUid ? uid : undefined)
                .then(function (poems) {
                    vm.poems = poems;
                });
        }

        function _findUser(){
            userService
                .findUserById(uid)
                .then(function (res) {
                    vm.errorMsg = res.msg;
                    vm.profile = res.user;
                });
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
                leftLink: {clickCb: logout, href: "javacript:void(0)", iconClass: "glyphicon-log-out", name: "Logout"},
                name: "Profile",
                rightLink: readOnlyFlag ? followNav : saveUserNav
            };
        }

        function _loadContent() {
            vm.maxLines = 3;

            _findUser();
            _findFavoritesByUser();
            _findFollowers();
            _findPoems();
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