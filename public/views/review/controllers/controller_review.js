(function () {
    angular
        .module("pp")
        .controller("reviewEditController", reviewEditController);

    function reviewEditController($routeParams, $location, authUser, poemService, sharedService, reviewService) {
        var vm = this,
            poemId,
            reviewId;

        vm.deleteReview = deleteReview;
        vm.saveReview = saveReview;

        (function init() {
            _parseRouteParams();
            _fetchTemplates();
            _initHeaderFooter();
            _loadContent();
        })();

        function deleteReview() {
            reviewService
                .deleteReview(reviewId)
                .then(function () {
                    $location.url("poem/" + poemId);
                });
        }

        function saveReview() {
            reviewService
                .saveReview(reviewId, vm.review, poemId)
                .then(function (review) {
                    vm.successMsg = "Success";
                    vm.errorMsg = undefined;
                    $location.url("poem/" + poemId + "/review/" + review._id)
                })
                .catch(function (res) {
                    vm.successMsg = null;
                    vm.errorMsg = res;
                });
        }

        function _fetchTemplates() {
            vm.templates = Object.assign(
                sharedService.getTemplates(),
                poemService.getTemplates(),
                reviewService.getTemplates()
            );
        }

        function _findPoem() {
            poemService
                .findPoem(poemId)
                .then(function (poem) {
                    poem.text = poem.lines.join("\n"); // TODO this splitting belongs in the service or server
                    vm.poem = poem;
                })
                .catch(function (err) {
                    vm.successMsg = null;
                    vm.errorMsg = err;
                });
        }

        function _findReview() {
            if (reviewId) {
                reviewService
                    .findReview(reviewId)
                    .then(function (review) {
                        vm.review = review;
                        vm.reviewEditFlag = review.reviewer._id === authUser._id;
                        _initHeaderFooter();
                    })
                    .catch(function (err) {
                        vm.successMsg = null;
                        vm.errorMsg = err;
                    });
            } else {
                vm.review = {reviewer: authUser};
                vm.reviewEditFlag = true;
            }
        }

        function _initHeaderFooter() {
            vm.navHeader = {
                leftLink: {href: "#!/poem/" + poemId, iconClass: "glyphicon-chevron-left", name: "Poem"},
                name: "Review",
                rightLink: vm.reviewEditFlag === undefined || vm.reviewEditFlag ? {
                    clickCb: saveReview,
                    href: "javacript:void(0)",
                    iconClass: "glyphicon-floppy-save",
                    name: "Save"
                } : undefined
            };
        }

        function _loadContent() {
            _findPoem();
            _findReview();
        }

        function _parseRouteParams() {
            poemId = $routeParams["poemId"];
            if ($routeParams["reviewId"]) { // TODO are these checks necessary?
                reviewId = $routeParams["reviewId"];
            }
        }
    }
})();