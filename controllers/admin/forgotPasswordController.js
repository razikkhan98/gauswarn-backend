const asyncHandler = require("express-async-handler");
const forgotPasswordModal = require("../../model/admin/forgotPasswordModal");
const bcrypt = require("bcryptjs");

exports.forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const hostname = req.hostname;

  try {
    const user = await forgotPasswordModal.findUserByEmail(email);
    if (!user) {
      return res.json({ message: "Email not found" });
    }
    // console.log(user)

    const otp = await forgotPasswordModal.sendOTPEmail(
      user?.email,
      hostname
    );
    console.log('otp:------ ', otp);
    
    res.json({ message: "OTP sent your email successfully."});
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
    return res.json({ message: "New password is required" });
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
    res.json({ message: msg });
  } catch (error) {
    console.error(error);
    res.json({ message: "Server error" });
  }
});
