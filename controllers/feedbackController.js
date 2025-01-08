const asyncHandler = require("express-async-handler");
const reviewModel = require("../model/feedbackModel");

// Add a new review
exports.feedback = asyncHandler(async (req, res) => {
  try {
    const { name, email, rating, feedback } = req.body;
    console.log(name, email, rating);
    if (!name || !email || !rating) {
      return res
        .status(400)
        .json({ message: "Name, email, and rating are required" });
    }

    const reviewId = await reviewModel.addReview(name, email, rating, feedback);
    res.status(201).json({
      success: true,
      message: "Review submitted successfully!",
      reviewId,
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ error: "Failed to submit review" });
  }
});

// Fetch reviews and calculate statistics
exports.getReviews = asyncHandler(async (req, res) => {
  try {
    const reviews = await reviewModel.getAllReviews();

    if (!reviews?.length) {
      return res.status(200).json({
        averageRating: 0,
        totalReviews: 0,
        ratingsBreakdown: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
        reviews: [],
      });
    }
    const totalReviews = reviews?.length;

    const ratingsBreakdown = [1, 2, 3, 4, 5].reduce((acc, rating) => {
      acc[rating] = reviews.filter((review) => review.rating === rating).length;
      return acc;
    }, {});

    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews ||
      0;

    res.status(200).json({
      averageRating: parseFloat(averageRating.toFixed(2)),
      totalReviews,
      ratingsBreakdown: {
        5: ((ratingsBreakdown[5] || 0) / totalReviews) * 100,
        4: ((ratingsBreakdown[4] || 0) / totalReviews) * 100,
        3: ((ratingsBreakdown[3] || 0) / totalReviews) * 100,
        2: ((ratingsBreakdown[2] || 0) / totalReviews) * 100,
        1: ((ratingsBreakdown[1] || 0) / totalReviews) * 100,
      },
      reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  } finally {
  }
});

// new

// Get Single Review by ID
exports.getReviewById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const review = await reviewModel.getReviewByIdModal(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({ review });
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ error: "Failed to fetch review" });
  }
});

// Update Review
exports.updateReviewById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, rating, feedback } = req.body;
    const isUpdated = await reviewModel.updateReviewModal(
      id,
      name,
      email,
      rating,
      feedback
    );
    if (!isUpdated) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({ message: "Review updated successfully!" });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Failed to update review" });
  }
});

// Delete Review
exports.deleteReviewById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const isDeleted = await reviewModel.deleteReviewModal(id);
    if (!isDeleted) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({ message: "Review deleted successfully!" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Failed to delete review" });
  }
});
