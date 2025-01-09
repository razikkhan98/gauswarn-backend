const asyncHandler = require("express-async-handler");
const adminLoginAndRegisterModel = require("../model/adminLoginAndRegisterModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.adminUserLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email && !password) {
    return res.json({
      message: "Please provide either email , mobile number and password",
    });
  }

  // Check if user exists  by email or phone
  const user = await adminLoginAndRegisterModel.findAdminUserByEmail(email);
  if (!user) {
    return res.json({ message: "Email does not exist" });
  }

  // Generate and send JWT token
  const token = jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "30 day",
  });

  // If the user is found, login is successful
  return res.status(200).json({
    success: true,
    message: "Login successful.",
    accessToken: token,
  });
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
