const asyncHandler = require("express-async-handler");
const registerModel = require("../../../model/users/rajlaxmi/registerModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.userLogin = asyncHandler(async (req, res) => {
  try {
    const { user_email, user_password } = req.body;
    
    // Validate required fields
    if (!user_email || !user_password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    
    // Check if user exists
    const user = await registerModel.findUserByEmail(user_email);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    
    // Compare password
    const isMatch = await bcrypt.compare(user_password, user.user_password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "default_secret_key", {
      expiresIn: "1d",
    });
    
    // Return response
    res.status(200).json({
      success: true,
      message: "User login successfully",
      user: {
        id: user._id,
        name: user.user_first_name,
        uID: user.uid,
      },
      date: new Date().toISOString(), // Current timestamp
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
});