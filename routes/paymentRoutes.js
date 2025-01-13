// routes/paymentRoutes.js

const express = require("express");
const {
  createPaymentAndGenerateUrl,
  getPhonePeUrlStatusAndUpdatePayment,
} = require("../controllers/paymentControllers");
const { errorHandler } = require("../middlewares/errorHandler");
const router = express.Router();

/**
 * phonePe routes
 * */
router.post("/create-order", createPaymentAndGenerateUrl);
router.post("/status", getPhonePeUrlStatusAndUpdatePayment);

router.use(errorHandler);

module.exports = router;
