// routes/paymentRoutes.js

const express = require("express");
const productController = require("../controllers/productController");
const router = express.Router();
const contactController = require("../controllers/contactController");
const adminLoginAndRegisterController = require("../controllers/adminLoginAndRegisterController");
const feedbackController = require("../controllers/feedbackController");
const adminUserInfoController = require("../controllers/adminUserInfoController");

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

/** Contact route */
router.get("/getAllContact", contactController.getAllContact);
/** Contact route end */

/** admin registration*/
router.post("/register", adminLoginAndRegisterController.adminUserRegister);

/** admin login*/
router.post("/login", adminLoginAndRegisterController.adminUserLogin);

/** admin feedback*/
// get All
router.get("/allfeedback", feedbackController.getReviews);
// create feedback
router.post("/createFeedback", feedbackController.feedback);
/** admin feedback end*/

/** user info for payment table*/
router.get("/getAllUserInfo", adminUserInfoController.getAllUserInfo);
/** user info for payment table end*/

/** order details payment table*/
router.get("/getAllOrderDetails", adminUserInfoController.getAllOrderDetails);
/** order details payment table end*/
module.exports = router;
