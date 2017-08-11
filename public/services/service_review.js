(function () {
    angular
        .module("pp")
        .factory("reviewService", reviewService);

    function reviewService($http) {
        return {
            deleteReview: deleteReview,
            findReview: findReview,
            findReviews: findReviews,
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
            if(userId) {
                return $http({
                    url: "/api/poem/reviews",
                    method: "GET",
                    params: userId ? {userId: userId} : undefined
                }).then(function (res) {
                    return res.data;
                });
            } else {
                return $http({
                    url: "/api/poem/reviews",
                    method: "GET",
                    params: poemId ? {poemId: poemId} : undefined
                }).then(function (res) {
                    return res.data;
                });
            }
        }

        function saveReview(reviewId, review, userId, poemId) {
            if (reviewId) {
                return $http
                    .put("/api/poem/review", {reviewId: reviewId, review: review})
                    .then(function (res) {
                        return res.data;
                    });
            } else {
                return $http
                    .post("/api/poem/review", {review: review, userId: userId, poemId: poemId})
                    .then(function (res) {
                        return res.data;
                    });
            }
        }

    }
})();