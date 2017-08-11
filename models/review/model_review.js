module.exports = function (app) {
    var mongoose = require("mongoose"),
        reviewSchema = app.aoaRequire("models/review/schema_review")(),
        reviewModel = mongoose.model("review", reviewSchema, reviewSchema.options.collection);

    return Object.assign(reviewModel, {
        createReview: createReview,
        deleteReview: deleteReview,
        findReviewById: findReviewById,
        findReviewsForPoem: findReviewsForPoem,
        findReviewsByReviewer: findReviewsByReviewer,
        updateReview: updateReview
    });

    function createReview(review) {
        return reviewModel.create(review);

    }
    function deleteReview(reviewId) {
        return reviewModel.remove({_id: reviewId});
    }

    function findReviewsByReviewer(userId) {
        return reviewModel
            .find({reviewer: userId})
            .populate("reviewer");
    }

    function findReviewsForPoem(poemId) {
        return reviewModel
            .find({_poemId: poemId})
    }

    function findReviewById(reviewId) {
        return reviewModel
            .findById(reviewId)
            .populate("reviewer");
    }

    function updateReview(reviewId, review) {
        return reviewModel.update({_id: reviewId},{$set: review});
    }
};