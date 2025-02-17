// routes/ussersRoutes.js

const express = require("express");
const router = express.Router();
const registerController = require("../../../controllers/users/rajlaxmi/registerController");
const loginController =require("../../../controllers/users/rajlaxmi/loginController");


//  // Routes

//Register
router.post("/register", registerController.userRegister);

//Login
router.post("/login", loginController.userLogin);

module.exports = router;