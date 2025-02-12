const asyncHandler = require("express-async-handler");
const adminLoginAndRegisterModel = require("../model/adminLoginAndRegisterModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middlewares/authMiddleware");

exports.adminUserLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    return res.json({
      message: "Please provide both email and password.",
    });
  }

  try {
    const user = await adminLoginAndRegisterModel.findAdminUserByEmail(email);

    if (!user) {
      return res.json({
        message: "Email does not exist.",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.json({
        message: "Invalid password.",
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, userName: user.full_name },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      accessToken: token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});

exports.adminUserRegister = asyncHandler(async (req, res) => {
  const { full_name, email, mobile_number, password, role } = req.body;

  //Validation
  if (
    !full_name &&
    !email &&
    !mobile_number &&
    !password &&
    !role
    // || !confirm_password
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    //Check if email already exists in database
    const emailExist = await adminLoginAndRegisterModel.findAdminUserByEmail(
      email
    );
    if (emailExist) {
      return res.status(400).json({ message: "Email already exist" });
    }

    //hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const newRegister = {
      full_name,
      email,
      mobile_number,
      password: hashedPassword,
      role,
    };

    await adminLoginAndRegisterModel.adminUserRegister(newRegister);
    res
      .status(201)
      .json({ success: true, message: "User Register Successfully" });
  } catch (error) {
    console.error("Database error", error);
    res.json({ message: "Database error", error: error.message });
  }
});

exports.meAPI = asyncHandler(async (req, res) => {
  try {
    delete req.user.password;
    const user = req.user;
    res.json({ user, msg: "sss" });
  } catch (error) {
    console.log(error);
    res.send("An error occured");
  }
});
