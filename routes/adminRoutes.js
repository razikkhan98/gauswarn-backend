// routes/paymentRoutes.js

const express = require("express");
const productController = require("../controllers/productController");
const router = express.Router();

/** Products routes  * */
// create
router.post("/createProduct", productController.addProduct);
// get All
router.get("/getAllProduct", productController.getAllProducts);
// get single by id
router.post("/getProductById/:id", productController.getProductById);
// update single by id
router.post("/updateProductById/:id", productController.updateProduct);
// delete
router.post("/deleteProductById/:id", productController.deleteProduct);

/** Products routes end * */

module.exports = router;
