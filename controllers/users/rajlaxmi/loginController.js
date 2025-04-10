const asyncHandler = require("express-async-handler");
const registerModel = require("../../../model/users/rajlaxmi/registerModel");
const addtocartModel = require("../../../model/users/rajlaxmi/addtocartModel");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize"); // Import Sequelize Operators

exports.userLogin = asyncHandler(async (req, res) => {
  // Email/mobile , password to login api input field 2 seconds
  const { emailmobile, password } = req.body;

  if (!emailmobile || !password) {
    return res.json({
      success: false,
      message: "Email/Mobile and password are required",
    });
  }

  try {
    // Determine if input is email or phone number
    const isEmail = /\S+@\S+\.\S+/.test(emailmobile);

    // Find user by email or phone
    const user = isEmail
      ? await registerModel.findUserByEmail(emailmobile)
      : await registerModel.findUserByPhone(emailmobile);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, mobileNumber: user.mobileNumber },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Fetch user's cart data
    const cartItems = await addtocartModel.getCartItemsByUserId(user.uid);
    console.log("cartItems: ", cartItems);

    res.json({
      success: true,
      message: "Login successful",
      token,
      uid: user.uid,
      email: user.email,
      name: user.firstName,
      last_name: user.lastName,
      cart: cartItems,
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});
