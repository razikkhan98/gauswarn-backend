// routes/ussersRoutes.js

const express = require("express");
const router = express.Router();
const registerController = require("../../../controllers/users/rajlaxmi/registerController");
const loginController =require("../../../controllers/users/rajlaxmi/loginController");
const forgotPasswordController = require("../../../controllers/users/rajlaxmi/forgotPasswordController");
const addtocartController = require("../../../controllers/users/rajlaxmi/addtocartController");
const contactController  = require("../../../controllers/users/rajlaxmi/contactController");
const feedbackController = require("../../../controllers/users/rajlaxmi/feedbackController");
const paymentController = require("../../../controllers/users/rajlaxmi/paymentController");
const prodcutController = require("../../../controllers/users/rajlaxmi/productController");
const reviewController = require("../../../controllers/users/rajlaxmi/reviewController");

//  // Routes

// Register
router.post("/register", registerController.userRegister);

// Login
router.post("/login", loginController.userLogin);

//  Forget password
// router.post("/forgotPassword", forgotPasswordController.forgotPassword);

// Re-set Password
// router.post("/resetPassword", forgotPasswordController.passwordReset);

// Add To Cart
router.post("/user/addtocart", addtocartController.addToCart);

// // User Add to cart remove
// router.delete("/removecart", addtocartController.removeFromCart);

// //  Update cart item
router.put("/updateCart", addtocartController.updateFromCart);

// Get cart
router.get("/getAllCart", addtocartController.getAllCarts);

// Review
// router.post("/review", reviewController.userReview);

// router.get("/getAllReview", reviewController.getReviews);


// Contact
router.post("/contact", contactController.userContact);

// Feedback
router.post("/feedback", feedbackController.feedback);

// Get All Feedback
router.get("/getAllFeedback", feedbackController.getReviews)

// Feedback by id
// router.get("/getReviewbyId", feedbackController.getReviewById);

// Payment 
router.post("/payment", paymentController.userPayment);

// Product 
router.post("/product", prodcutController.addProduct);

// Get All Product 
router.get("/getAllProduct", prodcutController.getAllProducts)






module.exports = router;