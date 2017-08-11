module.exports = function (app) {
    var mongoose = require("mongoose"),
        reviewSchema = app.aoaRequire("models/poem/schema_review")(),
        reviewModel = mongoose.model("reviewModel", reviewSchema, reviewSchema.options.collection);

    return Object.assign(reviewModel, {
        createReview: createReview,
        findAllReviewsForPoem: findAllReviewsForPoem,
        findAllReviewsByReviewer: findAllReviewsByReviewer,
        findReviewById: findReviewById,
        updateReview: updateReview,
        deleteReview: deleteReview
    });

    function createReview(review) {
        return reviewModel.create(review);

    }
    function deleteReview(reviewId) {
        return reviewModel.remove({_id: reviewId});

    }

    function findAllReviewsByReviewer(userId) {
        return reviewModel
            .find({_poemId: userId})
            .exec();
    }

    function findAllReviewsForPoem(poemId) {
        return reviewModel
            .find({_poemId: poemId})
            .exec();
    }

    function findReviewById(reviewId) {
        return reviewModel.findById(reviewId);
    }

    function updateReview(reviewId, review) {
        return reviewModel.update({_id: reviewId},{$set: review});

    }


};