const asyncHandler = require("express-async-handler");
const registerModel = require("../../../model/users/rajlaxmi/registerModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize"); // Import Sequelize Operators

// exports.userLogin = asyncHandler(async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Validate required fields
//     if (!user_email || !user_password) {
//       return res.status(400).json({ message: "Please fill in all fields" });
//     }

//     // Check if user exists
//     const user = await registerModel.findUserByEmail(user_email);
//     if (!user) {
//       return res.status(400).json({ message: "User does not exist" });
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(user_password, user.user_password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid password" });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "default_secret_key", {
//       expiresIn: "1d",
//     });

//     // Return response
//     res.status(200).json({
//       success: true,
//       message: "User login successfully",
//       user: {
//         id: user._id,
//         name: user.user_first_name,
//         uID: user.uid,
//       },
//       date: new Date().toISOString(), // Current timestamp
//       token,
//     });
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ success: false, message: "Server error", error: error.message })
//   }
// });

exports.userLogin = asyncHandler(async (req, res) => {
  // Email/mobile , password to login api input field 2 seconds
  const { emailmobile, password } = req.body;

  if (!emailmobile || !password) {
    return res
      .status(400)
      .json({ message: "Email/Mobile and password are required" });
  }

  try {
    // Determine if input is email or phone number
    const isEmail = /\S+@\S+\.\S+/.test(emailmobile);

    // Find user by email or phone
    const user = isEmail
      ? await registerModel.findUserByEmail(emailmobile)
      : await registerModel.findUserByPhone(emailmobile);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, mobileNumber: user.mobileNumber },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  

    res.json({ success: true, message: "Login successful", token, uid: user.uid});
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
