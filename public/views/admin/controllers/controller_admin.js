(function () {
    angular
        .module("admin")
        .controller("adminController", adminController);

    function adminController($routeParams, $location, adminService, reviewService, authService, poemService, sharedService, userService) {
        var vm = this,
            uid,
            authenticatedUid,
            readOnlyFlag;

        vm.deleteUser = deleteUser;
        vm.deletePoemByUser = deletePoemByUser;
        vm.deleteReviewByReviewer = deleteReviewByReviewer;
        vm.deleteTranslatedPoem = deleteTranslatedPoem;
        vm.deleteFavorite = deleteFavorite;
        vm.deleteFollower = deleteFollower;

        function init() {
            _fetchTemplates();
            _loadContent();
        }

        function deleteUser(uid) {
            adminService
                .deleteUser(uid)
                .then(function() {
                    $location.url('/admin');
                });
        }

        function deletePoemByUser(pid, uid) {
            adminService
                .deletePoemByUser(pid, uid)
                .then(function() {
                    _findPoems();
                    $location.url('/admin');
                });
        }

        function deleteReviewByReviewer(reviewId, reviewerId) {
            adminService
                .deleteReviewByReviewer(reviewId, reviewerId)
                .then(function() {
                    _findReviews();
                    $location.url('/admin');
                });
        }

        function deleteTranslatedPoem(transId, uid) {
            adminService
                .deleteTranslatedPoem(transId, uid)
                .then(function() {
                    $location.url('/admin');
                });
        }

        function deleteFavorite(favoriteId, uid) {
            adminService
                .deleteFavorite(favoriteId, uid)
                .then(function() {
                    $location.url('/admin');
                });
        }

        function deleteFollower(followerId, uid) {
            adminService
                .deleteFollower(followerId, uid)
                .then(function() {
                    $location.url('/admin');
                });
        }

        function _fetchTemplates() {
            vm.templates = sharedService.getTemplates();
        }

        function _loadContent() {
            vm.maxLines = 3;

            _findUser();
            _findFavoritesByUser();
            _findFollowers();
            _findPoems();
            _findReviews();
        }

        function _findReviews() {
            poemService
                ._findReviews(reviewerId)
                .then(function (res) {
                    vm.reviewes = res.findAllReviewsByReviewer;
                })
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

    }
})();