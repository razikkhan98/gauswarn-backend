// routes/ussersRoutes.js

const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController")
const feedbackController = require("../controllers/feedbackController")
// const paymentController = require("../controllers/paymentController")
const contactController = require("../controllers/contactController");
const { exportTableToExcel } = require("../controllers/excelController");






// User Add to cart
router.post('/login/addtocart', cartController.addToCart);

// User Add to cart remove
router.delete('/removecart', cartController.removeFromCart);

router.post('/updateCartItem', cartController.updateFromCart);

// User Feedback
router.post('/feedback', feedbackController.feedback)

// Route to fetch reviews
router.get("/allfeedback", feedbackController.getReviews);

// User Contact
router.post('/contact', contactController.contact)


// testingCSV
router.get('/getCSV', exportTableToExcel)

// User Payment 
// router.post('/payment', paymentController.payment)






module.exports = router;
