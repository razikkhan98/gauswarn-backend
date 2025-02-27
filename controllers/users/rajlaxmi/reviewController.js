// const reviewModel = require("../../../model/users/rajlaxmi/reviewModel");
// const asyncHandler = require("express-async-handler");

// exports.userReview = asyncHandler(async (req, res) => {
//     try {
//         const {
//             uid,
//             user_name,
//             user_email,
//             user_rating
//         } = req.body;
//         // Validation
//         if (!uid && !user_name && !user_email && !user_rating) {
//             return res.status(400).json({ message: "Please provide all required fileds" });
//         }

//         // New user review
//         const newReview = {
//             uid,
//             user_name,
//             user_email,
//             user_rating
//         }
//         await reviewModel.userReview(newReview);
//         return res.status(200).json({ success: true, message: "Add Review Successfully" });
//     } catch (error) {
//         console.error("Database Error", error);
//         throw error;
//     }
// });







// // Add a new review
// exports.userReview = asyncHandler(async (req, res) => {
//   try {
//     const {uid, user_name, user_email, user_rating } = req.body;
//     console.log(req.body);
//     if (!uid || !user_name || !user_email || !user_rating ===undefined) {
//         return res.status(400).json({ message: "Name, email, and rating are required" });
//     }
    
//     const reviewId = await reviewModel.addReview(uid, user_name, user_email, user_rating);
//     console.log(reviewId);
//     res.status(201).json({
//       success: true,
//       message: "Review submitted successfully!",
//       reviewId,
//     });
//   } catch (error) {
//     console.error("Error submitting review:", error);
//     res.status(500).json({ error: "Failed to submit review" });
//   }
// });

// // Fetch reviews and calculate statistics
// exports.getReviews = asyncHandler(async (req, res) => {
//   try {
//     const reviews = await reviewModel.getAllReviews();

//     if (!reviews?.length) {
//       return res.status(200).json({
//         averageRating: 0,
//         totalReviews: 0,
//         ratingsBreakdown: {
//           5: 0,
//           4: 0,
//           3: 0,
//           2: 0,
//           1: 0,
//         },
//         reviews: [],
//       });
//     }
//     const totalReviews = reviews?.length;

//     const ratingsBreakdown = [1, 2, 3, 4, 5].reduce((acc, rating) => {
//       acc[rating] = reviews.filter((review) => review.rating === rating).length;
//       return acc;
//     }, {});

//     const averageRating =
//       reviews.reduce((sum, review) => sum + review.user_rating, 0) / totalReviews || 0;

//     res.status(200).json({
//       averageRating: parseFloat(averageRating.toFixed(2)),
//       totalReviews,
//       ratingsBreakdown: {
//         5: ((ratingsBreakdown[5] || 0) / totalReviews) * 100,
//         4: ((ratingsBreakdown[4] || 0) / totalReviews) * 100,
//         3: ((ratingsBreakdown[3] || 0) / totalReviews) * 100,
//         2: ((ratingsBreakdown[2] || 0) / totalReviews) * 100,
//         1: ((ratingsBreakdown[1] || 0) / totalReviews) * 100,
//       },
//       reviews,
//     });
//   } catch (error) {
//     console.error("Error fetching reviews:", error);
//     res.status(500).json({ error: "Failed to fetch reviews" });
//   } finally {
//   }
// });


















// Get All Reviews
// exports.getReviews = asyncHandler(async (req, res) => {
//     try {
//         const reviews = await reviewModel.getAllReviews();

//         if (!reviews?.length) {
//             return res.status(200).json({
//                 averageRating: 0,
//                 totalReviews: 0,
//                 ratingsBreakdown: {
//                     5: 0,
//                     4: 0,
//                     3: 0,
//                     2: 0,
//                     1: 0,
//                 },
//                 reviews: [],
//             });
//         }
//         const totalReviews = reviews?.length;

//         const ratingsBreakdown = [1, 2, 3, 4, 5].reduce((acc, rating) => {
//             acc[rating] = reviews.filter((review) => review.rating === rating).length;
//             return acc;
//         }, {});

//         const averageRating =
//             reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews ||
//             0;

//         res.status(200).json({
//             averageRating: parseFloat(averageRating.toFixed(2)),
//             totalReviews,
//             ratingsBreakdown: {
//                 5: ((ratingsBreakdown[5] || 0) / totalReviews) * 100,
//                 4: ((ratingsBreakdown[4] || 0) / totalReviews) * 100,
//                 3: ((ratingsBreakdown[3] || 0) / totalReviews) * 100,
//                 2: ((ratingsBreakdown[2] || 0) / totalReviews) * 100,
//                 1: ((ratingsBreakdown[1] || 0) / totalReviews) * 100,
//             },
//             reviews,
//         });
//     } catch (error) {
//         console.error("Error fetching reviews:", error);
//         res.status(500).json({ error: "Failed to fetch reviews" });
//     } finally {
//     }
// });
