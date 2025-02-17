// routes/paymentRoutes.js

const express = require("express");
const router = express.Router();
const productController = require("../../controllers/users/gauswarn/productController");
const contactController = require("../../controllers/users/gauswarn/contactController");
const registerController = require("../../controllers/admin/registerController");
const loginController = require("../../controllers/admin/loginController");
const feedbackController = require("../../controllers/users/gauswarn/feedbackController");
const userInfoController = require("../../controllers/admin/userInfoController");
const forgotPasswordController = require("../../controllers/admin/forgotPasswordController");
const monthlyReportController = require("../../controllers/admin/monthlyReportController");
const offlineCustomerController = require("../../controllers/admin/offlineCustomerController");
const { errorHandler } = require("../../middlewares/errorHandler");
const { authMiddleware } = require("../../middlewares/authMiddleware");

// admin registration
router.post("/register", registerController.adminUserRegister);

//  admin login
router.post("/login", loginController.adminUserLogin);

//  forget password
router.post("/forgetPassword", forgotPasswordController.forgetPassword);

// re-set password
router.post("/reset", forgotPasswordController.passwordReset);

// add new Product
router.post("/createProduct", authMiddleware, productController.addProduct);

// get all products
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

// Contact
router.get("/getAllContact", authMiddleware, contactController.getAllContact);

// get All feedback
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

// get all users
router.get(
  "/getAllUserInfo",
  authMiddleware,
  userInfoController.getAllUserInfo
);

// get all orders
router.get(
  "/getAllOrderDetails",
  authMiddleware,
  userInfoController.getAllOrderDetails
);

// get all Monthly Report
router.get("/getAllSales", authMiddleware, monthlyReportController.getAllSales);

// ADD new order offline customer
router.post(
  "/addOfflineCustomer",
  authMiddleware,
  offlineCustomerController.addOfflineCustomer
);

// get All offline customer
router.get(
  "/getAllOfflineCustomer",
  authMiddleware,
  offlineCustomerController.getAllOfflineCustomers
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

router.get("/me", authMiddleware, registerController.meAPI);


router.use(errorHandler);

module.exports = router;

// backlog
// ALTER TABLE `organic_farmer_table_product` ADD `product_website_name` VARCHAR(255) NULL DEFAULT NULL AFTER `test`;
// ALTER TABLE `organic_farmer_admin_user` ADD `role` VARCHAR(255) NULL DEFAULT NULL AFTER `test`;
