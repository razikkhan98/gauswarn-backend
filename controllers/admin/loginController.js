const asyncHandler = require("express-async-handler");
const registerModel = require("../../model/admin/registerModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");



exports.adminUserLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    return res.json({
      message: "Please provide both email and password.",
    });
  }

  try {
    const user = await registerModel.findAdminUserByEmail(email);

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

    return res.json({
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