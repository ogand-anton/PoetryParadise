(function () {
    angular
        .module("pp")
        .controller("profileController", profileController);

    function profileController($routeParams, $location, authUser,
                               authService, poemService, reviewService, sharedService, translationService, userService) {
        var vm = this,
            uid,
            poemEditFlag;

        vm.followUser = followUser;
        vm.saveUser = saveUser;
        vm.logout = logout;
        vm.unFavoritePoem = unFavoritePoem;
        vm.unFollowUser = unFollowUser;

        (function init() {
            _parseRouteParams();
            _fetchTemplates();
            _initHeaderFooter();
            _loadContent();
        })();

        function followUser() {
            // TODO prevent following (a) yourself and (b) someone else multiple times
            userService
                .followUser(authUser._id, uid)
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
                .unFollowUser(authUser._id, followerId)
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
            if (uid !== authUser._id) { // read only profile
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
                .findPoems(uid)
                .then(function (poems) {
                    vm.poems = poems;
                });
        }

        function _findReviews() {
            if (uid === authUser._id) {
                reviewService
                    .findReviews(uid)
                    .then(function (reviews) {
                        vm.reviews = reviews;
                    });
            }
        }

        function _findTranslations() {
            translationService
                .findTranslations(uid)
                .then(function (translations) {
                    vm.translations = translations;
                })
        }

        function _findUser() {
            if (uid !== authUser._id) {
                userService
                    .findUserById(uid)
                    .then(function (res) {
                        vm.errorMsg = res.msg;
                        vm.profile = res.user;
                    });
            } else {
                vm.profile = authUser;
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
                leftLink: {clickCb: logout, href: "javacript:void(0)", iconClass: "glyphicon-log-out", name: "Logout"},
                name: "Profile",
                rightLink: poemEditFlag ? followNav : saveUserNav
            };
        }

        function _loadContent() {
            vm.maxLines = 3;
            vm.maxReviewLength = 50;

            uid = uid || authUser._id;

            _findFavoritesByUser();
            _findFollowers();
            _findPoems();
            _findReviews();
            _findTranslations();
            _findUser();
        }

        function _parseRouteParams() {
            if ($routeParams["uid"]) {
                uid = $routeParams["uid"];
                poemEditFlag = true;
                vm.uid = uid;

                if (uid === authUser._id) {
                    $location.url("profile");
                }
            }
        }
    }
})();