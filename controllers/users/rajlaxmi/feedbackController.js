const asyncHandler = require("express-async-handler");
const reviewModel = require("../../../model/users/rajlaxmi/feedbackModel");
const registerModel = require("../../../model/users/rajlaxmi/registerModel");

// Add a new review
exports.feedback = asyncHandler(async (req, res) => {
  try {
    const { uid, product_id, user_name, user_email, rating, feedback } =
      req.body;

    if (!uid || !user_name || !user_email || !rating || !product_id) {
      return res.json({ message: "Name, email, and rating are required" });
    }

    // Check uid in database
    const user = await registerModel.findUserByUid(uid);
    if (!user) {
      return res.json({ message: "User not found" });
    }

    const reviewId = await reviewModel.addReview(
      uid,
      product_id,
      user_name,
      user_email,
      rating,
      feedback
    );
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

// Fetch reviews
exports.getReviews = asyncHandler(async (req, res) => {
  try {
    const { product_id } = req.params;

    if (!product_id) {
      return res.json({ message: "product_id is required." });
    }

    const reviews = await reviewModel.getReviewsByProduct(product_id);
    console.log("reviews: ", reviews);

    if (!reviews?.length) {
      return res.json({
        averageRating: 0,
        totalReviews: 0,
        ratingsBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        reviews: [],
      });
    }

    const totalReviews = reviews.length;

    // Initialize ratings breakdown
    const ratingsBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      if (ratingsBreakdown[review.rating] !== undefined) {
        ratingsBreakdown[review.rating]++;
      }
    });

    // Calculate average rating
    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

    const getPercentage = (count) =>
      totalReviews > 0
        ? parseFloat(((count / totalReviews) * 100).toFixed(2))
        : 0;

    res.json({
      averageRating: parseFloat(averageRating.toFixed(2)),
      totalReviews,
      ratingsBreakdown: {
        5: getPercentage(ratingsBreakdown[5]),
        4: getPercentage(ratingsBreakdown[4]),
        3: getPercentage(ratingsBreakdown[3]),
        2: getPercentage(ratingsBreakdown[2]),
        1: getPercentage(ratingsBreakdown[1]),
      },
      reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// /----------------------------------------------------------------------------------------/

// admin
exports.getAllReviewsRajlaxmi = asyncHandler(async (req, res) => {
  try {
    const reviews = await reviewModel.getAllReviewsRajlaxmi();
    console.log("reviews: ", reviews);

    if (!reviews?.length) {
      return res.json({
        averageRating: 0,
        totalReviews: 0,
        ratingsBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        reviews: [],
      });
    }

    const totalReviews = reviews.length;

    // Initialize ratings breakdown
    const ratingsBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      if (ratingsBreakdown[review.rating] !== undefined) {
        ratingsBreakdown[review.rating]++;
      }
    });

    // Calculate average rating
    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

    const getPercentage = (count) =>
      totalReviews > 0
        ? parseFloat(((count / totalReviews) * 100).toFixed(2))
        : 0;

    res.json({
      averageRating: parseFloat(averageRating.toFixed(2)),
      totalReviews,
      ratingsBreakdown: {
        5: getPercentage(ratingsBreakdown[5]),
        4: getPercentage(ratingsBreakdown[4]),
        3: getPercentage(ratingsBreakdown[3]),
        2: getPercentage(ratingsBreakdown[2]),
        1: getPercentage(ratingsBreakdown[1]),
      },
      reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// admin
exports.deleteReviewsRajlaxmiById = asyncHandler(async (req, res) => {
  try {
    const { feedback_id } = req.params;

    if (!feedback_id) {
      return res.json({ message: "feedback_id is required." });
    }

    const reviews = await reviewModel.deleteReviewByIdRajlaxmi(feedback_id);
    console.log("reviews: ", reviews);

    res.json({
      success: true,
      message: "Delete successfully",
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});


