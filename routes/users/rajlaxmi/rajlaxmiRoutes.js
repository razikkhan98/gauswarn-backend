// routes/ussersRoutes.js

const express = require("express");
const router = express.Router();
const registerController = require("../../../controllers/users/rajlaxmi/registerController");
const loginController =require("../../../controllers/users/rajlaxmi/loginController");
const forgotPasswordController = require("../../../controllers/users/rajlaxmi/forgotPasswordController");
const addtocartController = require("../../../controllers/users/rajlaxmi/addtocartController");

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

// User Add to cart remove
router.delete("/removecart", addtocartController.removeFromCart);

// User Update cart item
router.put("/updateCartItem", addtocartController.updateFromCart);


module.exports = router;