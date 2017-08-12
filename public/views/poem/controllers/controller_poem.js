(function () {
    angular
        .module("pp")
        .controller("poemEditController", poemEditController);

    function poemEditController($routeParams, $location, authUser,
                                poemService, reviewService, sharedService, translationService, userService) {
        var vm = this,
            poemId;

        vm.addTranslation = addTranslation;
        vm.deletePoem = deletePoem;
        vm.requestReview = requestReview;
        vm.savePoem = savePoem;

        (function init() {
            _parseRouteParams();
            _fetchTemplates();
            _initHeaderFooter();
            _loadContent();
        })();

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
                .then(function (poem) {
                    vm.successMsg = "Success";
                    vm.errorMsg = undefined;
                    $location.url("poem/" + poem._id);
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
            if (authUser._id === authUser._id) {
                userService
                    .findFollowers(authUser._id)
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
                        vm.poemEditFlag = poem.author._id === authUser._id;
                        _initHeaderFooter();
                    })
                    .catch(function (err) {
                        vm.successMsg = null;
                        vm.errorMsg = err;
                    });
            } else {
                vm.poem = {author: authUser};
                vm.poemEditFlag = true;
            }
        }

        function _findReviews() {
            if (authUser._id === authUser._id) {
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
            vm.maxLines = 3;

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