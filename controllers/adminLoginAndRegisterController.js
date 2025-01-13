const asyncHandler = require("express-async-handler");
const adminLoginAndRegisterModel = require("../model/adminLoginAndRegisterModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.adminUserLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide both email and password.",
    });
  }

  try {
    // Check if the user exists
    const user = await adminLoginAndRegisterModel.findAdminUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        message: "Email does not exist.",
      });
    }

    // Compare passwords
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid password.",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d", // Adjusted expiration format
      }
    );

    // Successful login response
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      accessToken: token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});

exports.adminUserRegister = asyncHandler(async (req, res) => {
  const { full_name, email, mobile_number, password } = req.body;

  //Validation
  if (
    !full_name &&
    !email &&
    !mobile_number &&
    !password
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
