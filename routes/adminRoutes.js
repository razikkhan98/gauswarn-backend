// routes/paymentRoutes.js

const express = require("express");
const productController = require("../controllers/productController");
const router = express.Router();
const contactController = require("../controllers/contactController");
const adminLoginAndRegisterController = require("../controllers/adminLoginAndRegisterController");
const feedbackController = require("../controllers/feedbackController");
const adminUserInfoController = require("../controllers/adminUserInfoController");
const adminForgotAndResetPasswdController = require("../controllers/adminForgotAndResetPasswdController");
const CalculateGheeWebAppDataController = require("../controllers/CalculateGheeWebAppDataContoller");
const offlineCustomerController = require("../controllers/offlineCustomerController");
const { errorHandler } = require("../middlewares/errorHandler");
const { authMiddleware } = require("../middlewares/authMiddleware");

/** admin auth */
/** admin registration*/
router.post("/register", adminLoginAndRegisterController.adminUserRegister);

/** admin login*/
router.post("/login", adminLoginAndRegisterController.adminUserLogin);

//forget password
router.post(
  "/forgetPassword",
  adminForgotAndResetPasswdController.forgetPassword
);

//Re-set password
router.post("/reset", adminForgotAndResetPasswdController.passwordReset);

/** admin auth end */

/** --------------------------------------------------------------------------------------------- */

/** Products routes  * */
// create
router.post("/createProduct", authMiddleware, productController.addProduct);
// get All
router.get("/getAllProduct", authMiddleware, productController.getAllProducts);
// get single by id
router.post(
  "/getProductById/:id",
  authMiddleware,
  productController.getProductById
);
// update single by id
router.post(
  "/updateProductById/:id",
  authMiddleware,
  productController.updateProduct
);
// delete
router.post(
  "/deleteProductById/:id",
  authMiddleware,
  productController.deleteProduct
);

/** Products routes end * */

/** --------------------------------------------------------------------------------------------- */

/** Contact route */
router.get("/getAllContact", authMiddleware, contactController.getAllContact);
/** Contact route end */

/** --------------------------------------------------------------------------------------------- */

/** admin feedback*/
// get All
router.get("/allfeedback", authMiddleware, feedbackController.getReviews);
// create feedback
router.post("/createFeedback", authMiddleware, feedbackController.feedback);

// fetch single feedback by Id
router.post(
  "/getSingleFeedbackById/:id",
  authMiddleware,
  feedbackController.getReviewById
);

// fetch single feedback by Id and update
router.put(
  "/updateFeedbackById/:id",
  authMiddleware,
  feedbackController.updateReviewById
);

// fetch single feedback by Id and delete
router.delete(
  "/deleteFeedbackById/:id",
  authMiddleware,
  feedbackController.deleteReviewById
);
/** admin feedback end*/

/** user info for payment table*/
router.get(
  "/getAllUserInfo",
  authMiddleware,
  adminUserInfoController.getAllUserInfo
);
/** user info for payment table end*/

/** order details payment table*/
router.get(
  "/getAllOrderDetails",
  authMiddleware,
  adminUserInfoController.getAllOrderDetails
);
/** order details payment table end*/

/** Caculate data*/
router.get(
  "/getAllSales",
  authMiddleware,
  CalculateGheeWebAppDataController.getAllSales
);
/** Caculate data end*/

/** --------------------------------------------------------------------------------------------- */

/** admin offline customer */
// get All
router.get(
  "/getAllOfflineCustomer",
  authMiddleware,
  offlineCustomerController.getAllOfflineCustomers
);
// create offline customer
router.post(
  "/addOfflineCustomer",
  authMiddleware,
  offlineCustomerController.addOfflineCustomer
);

// fetch single offline customer by Id
router.post(
  "/getOfflineCustomerById/:id",
  authMiddleware,
  offlineCustomerController.getOfflineCustomerById
);

// fetch single offline customer by Id and update
router.put(
  "/updateOfflineCustomer/:id",
  authMiddleware,
  offlineCustomerController.updateOfflineCustomer
);

// fetch single offline customer by Id and delete
router.delete(
  "/deleteOfflineCustomerById/:id",
  authMiddleware,
  offlineCustomerController.deleteOfflineCustomerById
);
/** admin offline customer end*/

/** --------------------------------------------------------------------------------------------- */

/** get logined in user data pass token */
router.get("/me", authMiddleware, adminLoginAndRegisterController.meAPI);
/** get logined in user data */

router.use(errorHandler);

module.exports = router;

// backlog
// ALTER TABLE `organic_farmer_table_product` ADD `product_website_name` VARCHAR(255) NULL DEFAULT NULL AFTER `test`;
// ALTER TABLE `organic_farmer_admin_user` ADD `role` VARCHAR(255) NULL DEFAULT NULL AFTER `test`;
