const asyncHandler = require("express-async-handler");
const adminForgotAndResetPasswdModal = require("../model/adminForgotAndResetPasswdModal");
const bcrypt = require("bcryptjs");

exports.forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const hostname = req.hostname;

  try {
    const user = await adminForgotAndResetPasswdModal.findUserByEmail(email);
    if (!user) {
      return res.json({ message: "Email not found" });
    }
    // console.log(user)

    const otp = await adminForgotAndResetPasswdModal.sendOTPEmail(
      user?.email,
      hostname
    );

    res.status(200).json({ message: "OTP sent your email successfully.", otp });
  } catch (error) {
    console.error("Error is sending OTP email:", error);
    res.json({ message: "Internal server error" });
  }
});

// //   Re-set password
exports.passwordReset = asyncHandler(async (req, res) => {
  const { otp, newPassword } = req.body;

  //validation
  // Validation: Check if newPassword is provided
  if (!newPassword) {
    return res.status(400).json({ message: "New password is required" });
  }

  const reset = await adminForgotAndResetPasswdModal.findUserOTP(otp);
  if (!reset) {
    return res.json({ message: "OTP does not found" });
  }

  try {
    //check otp same or not
    if (reset.otp !== otp) {
      return res.json({ message: "OTP does not same" });
    }

    // Hash the new password before saving it
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear OTP
    const msg = await adminForgotAndResetPasswdModal.resetPassword(
      reset?.email,
      otp,
      hashedPassword
    );

    // await user.save();
    res.status(200).json({ message: msg });
  } catch (error) {
    console.error(error);
    res.json({ message: "Server error" });
  }
});
