module.exports = function (app, model) {
    var mongoose = require("mongoose"),
        reviewModel = model.reviewModel;

    app.get("/api/poem/reviews", findAllReviews);
    app.get("/api/poem/review", findReviewById);
    app.post("/api/poem/review", createReview);
    app.put("/api/poem/review", updateReview);
    app.delete("/api/poem/review", deleteReview());

    function createReview(req, res) {
        var review = req.body.review;
        review._userId = req.body.userId;
        review._poemId = req.body.poemId;
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
                res.status(200);
            });

    }

    function findAllReviews(req, res) {
        var userId = req.query.userId,
            poemId = req.query.poemId;
        if (userId) {
            reviewModel
                .findAllReviewsByReviewer(userId)
                .then(function (reviews) {
                    res.json(reviews);
                }, function () {
                    res.status(404).send("Could not find reviews by this reviewer")
                })
        }
        else if (poemId) {
            reviewModel
                .findAllReviewsForPoem(poemId)
                .then(function (reviews) {
                    res.json(reviews);
                }, function () {
                    res.status(404).send("Could not find reviews for this poem")
                })

        }
        else {
            res.status(404);

        }

    }

    function findReviewById(req, res) {
        var reviewId = req.query.reviewId;
        if (reviewId) {
            reviewModel
                .findReviewById(reviewId)
                .then(function (review) {
                    res.json(review);
                }, function () {
                    res.status(404).send("Review not found");
                });
        }
        else {
            res.status(404).send("Review not specified");
        }

    }


};