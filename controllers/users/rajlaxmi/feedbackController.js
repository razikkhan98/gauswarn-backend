// const asyncHandler = require("express-async-handler");
// const feedbackModel = require("../../../model/users/rajlaxmi/feedbackModel");

// exports.feedback =asyncHandler(async(req ,res)=>{
// try{
//     const {
//     uid,
//     user_name,
//     user_email,
//     feedback
// } = req.body;

// //Validation
// if(!uid && !user_name && !user_email && !feedback){
//    return res. status(400).json({message: "Please provide all required fileds"});
// }

// // New user feedback
// const newfeedback = {
//     uid,
//     user_name,
//     user_email,
//     feedback
// }
//  await feedbackModel.feedback(newfeedback);
//  return res.status(200).json({success: true , message: "feedback Successfully"});
// }catch(error){
//     console.error("Database Error", error);
//     throw error;
// }
// });

// // Get All Feedback
// exports.getAllFeedback = async (req, res) => {
//   try {
//     const feedback = await feedbackModel.getAllFeedback();
//     res.status(200).json({ feedback });
//   } catch (error) {
//     console.error("Error fetching feedback:", error);
//     res.json({ error: "Failed to fetch feedback" });
//   }
// };

const asyncHandler = require("express-async-handler");
const reviewModel = require("../../../model/users/rajlaxmi/feedbackModel");

// Add a new review
exports.feedback = asyncHandler(async (req, res) => {
  try {
    const { uid, product_id, user_name, user_email, rating, feedback } =
      req.body;
  

    if (!uid || !user_name || !user_email || !rating || !product_id) {
      return res
        .status(400)
        .json({ message: "Name, email, and rating are required" });
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
    const { uid, product_id } = req.query;

    if (!uid || !product_id) {
      return res
        .status(400)
        .json({ message: "uid and product_id are required." });
    }

    const reviews = await reviewModel.getReviewsByProduct(uid, product_id);

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

    const totalReviews = reviews.length;

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
  }
});

// Review get By Id
exports.getReviewById = asyncHandler(async (req, res) => {
  try {
    const { uid, product_id } = req.params;

    if (!uid || !product_id) {
      return res
        .status(400)
        .json({ message: "uid and product_id are required" });
    }

    const review = await reviewModel.getReviewByIdModal(uid, product_id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ review });
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ error: "Failed to fetch review" });
  }
});
