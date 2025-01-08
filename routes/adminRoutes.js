// routes/paymentRoutes.js

const express = require("express");
const productController = require("../controllers/productController");
const router = express.Router();

/**
 *
 * Products routes
 *
 * */

router.post("/createProduct", productController.addProduct);

module.exports = router;
