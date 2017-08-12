module.exports = function (app, model) {
    var reviewModel = model.reviewModel;

    app.delete("/api/review", deleteReview);
    app.get("/api/reviews", findReviews);
    app.get("/api/review", findReviewById);
    app.post("/api/review", createReview);
    app.put("/api/review", updateReview);

    function createReview(req, res) {
        var review = req.body.review;
        review._poem = req.body.poemId;

        reviewModel
            .createReview(review)
            .then(function (review) {
                res.json(review);
            }, function () {
                res.status(501).send("Unable to create review");
            });
    }

    function deleteReview(req, res) {
        var reviewId = req.query.reviewId;

        reviewModel
            .deleteReview(reviewId)
            .then(function () {
                res.sendStatus(200);
            });
    }

    function findReviews(req, res) {
        var userId = req.query.userId,
            poemId = req.query.poemId;

        if (poemId) {
            reviewModel
                .findReviewsForPoem(poemId)
                .then(function (reviews) {
                    res.json(reviews);
                }, function () {
                    res.status(404).send("Could not find reviews for this poem")
                })

        } else {
            reviewModel
                .findReviewsByReviewer(userId || req.user._id)
                .then(function (reviews) {
                    res.json(reviews);
                }, function () {
                    res.status(404).send("Could not find reviews by this reviewer")
                })
        }
    }

    function findReviewById(req, res) {
        var reviewId = req.query.reviewId;

        reviewModel
            .findReviewById(reviewId)
            .then(function (review) {
                res.json(review);
            }, function () {
                res.status(404).send("Review not found");
            });
    }

    function updateReview(req, res) {
        var review = req.body.review,
            reviewId = req.body.reviewId;

        reviewModel
            .updateReview(reviewId, review)
            .then(function () {
                res.json({_id: reviewId});
            }, function () {
                res.status(404).send("Unable to update review");
            });
    }
};