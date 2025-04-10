// routes/ussersRoutes.js

const express = require("express");
const router = express.Router();
const registerController = require("../../../controllers/users/rajlaxmi/registerController");
const loginController = require("../../../controllers/users/rajlaxmi/loginController");
const forgotPasswordController = require("../../../controllers/users/rajlaxmi/forgotPasswordController");
const addtocartController = require("../../../controllers/users/rajlaxmi/addtocartController");
const contactController = require("../../../controllers/users/rajlaxmi/contactController");
const feedbackController = require("../../../controllers/users/rajlaxmi/feedbackController");
const paymentController = require("../../../controllers/users/rajlaxmi/paymentController");
const prodcutController = require("../../../controllers/users/rajlaxmi/productController");
const wishlistController = require("../../../controllers/users/rajlaxmi/wishlistController");
const addressDetailController = require("../../../controllers/users/rajlaxmi/addressDetailController");

// Routes

// Register
router.post("/register", registerController.userRegister);

// Login
router.post("/login", loginController.userLogin);

//  Forget password
// router.post("/forgotPassword", forgotPasswordController.forgotPassword);

// Re-set Password
// router.post("/resetPassword", forgotPasswordController.passwordReset);

// Add To Cart
router.post("/addtocart", addtocartController.addToCart);

// // User Add to cart remove
router.delete("/removecart", addtocartController.deleteCartItem);

// //  Update cart item
router.post("/updateCart", addtocartController.updateCartItem);

// Get cart
router.get("/getAllCart", addtocartController.getAllCarts);

// Contact
router.post("/contact", contactController.userContact);

// Feedback
router.post("/feedback", feedbackController.feedback);

// Get All Feedback
router.get("/getAllFeedback/:product_id", feedbackController.getReviews);

// Payment
// phonePe routes
router.post("/create-order", paymentController.createPaymentAndGenerateUrl);
router.post("/status", paymentController.getPhonePeUrlStatusAndUpdatePayment);

// Add wishlist
router.post("/wishlist", wishlistController.addWishlist);

router.get("/getAllWishlist", wishlistController.getAllWishlist);

router.delete("/removeFromWishlist", wishlistController.removeFromWishlist);

// Add wishlist
router.post("/createAddressDetails", addressDetailController.addAddress);

router.get(
  "/getAddressDetails",
  addressDetailController.getAllAddressDetailsById
);

router.post("/deleteAddressDetails", addressDetailController.deleteAddress);

module.exports = router;
