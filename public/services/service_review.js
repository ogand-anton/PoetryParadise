(function () {
    angular
        .module("pp")
        .factory("reviewService", reviewService);

    function reviewService($http) {
        var templates = {
            review: "views/review/templates/template_review.html"
        };

        return {
            deleteReview: deleteReview,
            findReview: findReview,
            findReviews: findReviews,
            getTemplates: getTemplates,
            saveReview: saveReview
        };

        function deleteReview(reviewId) {
            return $http({
                url: "/api/poem/review",
                method: "DELETE",
                params: {reviewId: reviewId}
            }).then(function (res) {
                return res.data;
            });
        }

        function findReview(reviewId) {
            return $http({
                url: "/api/poem/review",
                method: "GET",
                params: {reviewId: reviewId}
            }).then(function (res) {
                return res.data;
            });
        }

        function findReviews(userId, poemId) {
            return $http({
                url: "/api/poem/reviews",
                method: "GET",
                params: userId ? {userId: userId} : {poemId: poemId}
            }).then(function (res) {
                return res.data;
            });
        }

        function getTemplates() {
            return templates;
        }

        function saveReview(reviewId, review, poemId) {
            if (reviewId) {
                return $http
                    .put("/api/poem/review", {reviewId: reviewId, review: review})
                    .then(function (res) {
                        return res.data;
                    });
            } else {
                return $http
                    .post("/api/poem/review", {review: review, poemId: poemId})
                    .then(function (res) {
                        return res.data;
                    });
            }
        }
    }
})();