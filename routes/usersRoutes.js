// routes/ussersRoutes.js

const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const feedbackController = require("../controllers/feedbackController");
const productController = require("../controllers/productController");

// const paymentController = require("../controllers/paymentController")
const contactController = require("../controllers/contactController");
const { exportTableToExcel } = require("../controllers/excelController");
const { errorHandler } = require("../middlewares/errorHandler");

// User Add to cart
router.post("/login/addtocart", cartController.addToCart);

// User Add to cart remove
router.delete("/removecart", cartController.removeFromCart);

router.post("/updateCartItem", cartController.updateFromCart);

// User Contact
router.post("/contact", contactController.contact);

// new

// User Add Feedback
router.post("/feedback", feedbackController.feedback);

// Route to fetch all reviews
router.get("/allfeedback", feedbackController.getReviews);

// fetch single feedback by Id
router.post("/getSingleFeedbackById/:id", feedbackController.getReviewById);

// fetch single feedback by Id and update
router.put("/UpdateFeedbackById/:id", feedbackController.updateReviewById);

// fetch single feedback by Id and delete
router.delete("/deleteFeedbackById/:id", feedbackController.deleteReviewById);

/** get all products */

router.get("/getAllProduct", productController.getAllProducts);
/** get all products */

// testingCSV
router.get("/getCSV", exportTableToExcel);

router.use(errorHandler);

module.exports = router;
