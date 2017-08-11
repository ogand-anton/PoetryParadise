(function () {
    angular
        .module("pp")
        .controller("poemEditController", poemEditController);

    function poemEditController($routeParams, $location,
                                authService, poemService, reviewService, sharedService, translationService, userService) {
        var vm = this,
            authenticatedUser,
            uid,
            poemId;

        vm.addTranslation = addTranslation;
        vm.deletePoem = deletePoem;
        vm.requestReview = requestReview;
        vm.savePoem = savePoem;

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
                    authenticatedUser = user;
                    uid = user._id;
                } else {
                    $location.url("login");
                }
                init();
            });

        function addTranslation() {
            $location.url("poem/" + poemId + "/translation");
        }

        function deletePoem() {
            poemService
                .deletePoem(poemId)
                .then(function () {
                    $location.url("profile");
                });
        }

        function requestReview(userId) {
            reviewService
                .saveReview(undefined, {reviewer: userId}, poemId)
                .then(function () {
                    vm.successMsg = "Review Requested";
                    vm.errorMsg = undefined;

                    _findReviews();
                })
                .catch(function (res) {
                    vm.successMsg = null;
                    vm.errorMsg = res;
                });
        }

        function savePoem() {
            vm.poem.lines = vm.poem.text ? vm.poem.text.split("\n") : [];

            poemService
                .savePoem(poemId, vm.poem)
                .then(function () {
                    vm.successMsg = "Success";
                    vm.errorMsg = undefined;
                })
                .catch(function (res) {
                    vm.successMsg = null;
                    vm.errorMsg = res;
                });
        }

        function _fetchTemplates() {
            vm.templates = Object.assign(
                sharedService.getTemplates(),
                poemService.getTemplates()
            );
        }

        function _findFollowers() {
            if (uid === authenticatedUser._id) {
                userService
                    .findFollowers(uid)
                    .then(function (followers) {
                        vm.followers = followers;
                    });
            }
        }

        function _findPoem() {
            if (poemId) {
                poemService
                    .findPoem(poemId)
                    .then(function (poem) {
                        poem.text = poem.lines.join("\n");
                        vm.poem = poem;
                        vm.poemEditFlag = poem.author._id === uid;
                        _initHeaderFooter();
                    })
                    .catch(function (err) {
                        vm.successMsg = null;
                        vm.errorMsg = err;
                    });
            } else {
                vm.poem = {author: authenticatedUser};
                vm.poemEditFlag = true;
            }
        }

        function _findReviews() {
            if (uid === authenticatedUser._id) {
                reviewService
                    .findReviews(undefined, poemId)
                    .then(function(reviews){
                        vm.reviews = reviews;
                    })
            }
        }

        function _findTranslations() {
            if (poemId) {
                translationService
                    .findTranslations(undefined, poemId)
                    .then(function (translations) {
                        vm.translations = translations;
                    })
            }
        }

        function _initHeaderFooter() {
            vm.navHeader = {
                leftLink: {href: "#!/profile", iconClass: "glyphicon-user", name: "Profile"},
                name: "Poem",
                rightLink: vm.poemEditFlag === undefined || vm.poemEditFlag ? {
                    clickCb: savePoem,
                    href: "javacript:void(0)",
                    iconClass: "glyphicon-floppy-save",
                    name: "Save"
                } : undefined
            };
        }

        function _loadContent() {
            vm.maxLines = 5;

            _findPoem();
            _findFollowers();
            _findReviews();
            _findTranslations();
        }

        function _parseRouteParams() {
            if ($routeParams["poemId"]) {
                poemId = $routeParams["poemId"];
            }
        }
    }
})();