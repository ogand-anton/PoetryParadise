(function () {
    angular
        .module("pp")
        .controller("profileController", profileController);

    function profileController($routeParams, $location, authUser,
                               authService, poemService, reviewService, sharedService, translationService, userService) {
        var vm = this,
            uid,
            profileEditFlag,
            followingFlag;

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
            userService
                .followUser(authUser._id, uid)
                .then(function () {
                    _findFollowedBy();
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
            followerId = followerId || uid;
            userService
                .unFollowUser(authUser._id, followerId)
                .then(function () {
                    _findFollowing();
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

        function _findFollowedBy() {
            userService
                .findUserFollowers(uid)
                .then(function (followers) {
                    vm.followers = followers;
                    followingFlag = !!followers.find(function (a) {return a._id === authUser._id});
                    _initHeaderFooter(); // TODO prevent double work
                });
        }

        function _findFollowing() {
            userService
                .findFollowers(uid)
                .then(function (followers) {
                    vm.following = followers;
                });
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
                    clickCb: followingFlag ? unFollowUser : followUser,
                    href: "javacript:void(0)",
                    iconClass: followingFlag ? "glyphicon-thumbs-down" : "glyphicon-thumbs-up",
                    name: followingFlag ? "Stop Following" : "Follow"
                };

            vm.navHeader = {
                leftLink: {clickCb: logout, href: "javacript:void(0)", iconClass: "glyphicon-log-out", name: "Logout"},
                name: "Profile",
                rightLink: profileEditFlag ? saveUserNav : followNav
            };

            vm.navFooter = [
                {href: "#!/poem", iconClass: "glyphicon-pencil", name: "Pen a Poem", sizeClass: "col-xs-6"},
                {href: "#!/search", iconClass: "glyphicon-search", name: "Search", sizeClass: "col-xs-6"}
            ];
        }

        function _loadContent() {
            vm.maxLines = 3;

            uid = uid || authUser._id;

            _findFavoritesByUser();
            _findFollowedBy();
            _findFollowing();
            _findPoems();
            _findReviews();
            _findTranslations();
            _findUser();

            vm.profileEditFlag = profileEditFlag;
        }

        function _parseRouteParams() {
            if ($routeParams["uid"]) {
                uid = $routeParams["uid"];
                profileEditFlag = false;
                vm.uid = uid;

                if (uid === authUser._id) {
                    $location.url("profile");
                }
            } else {
                profileEditFlag = true;
            }
        }
    }
})();