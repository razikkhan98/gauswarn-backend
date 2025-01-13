const db = require("../config/dbConnection");
const {
  forgetPasswordTemplate,
} = require("../emailTemplates/forgetPasswordTemplate");
const { createEmailTransporter } = require("../utils/helper");

//generate OTP 6 digits
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

//send OTP email
exports.sendOTPEmail = async (to, hostname) => {
  try {
    const otp = generateOTP(); // Generate OTP
    const transporter = await createEmailTransporter();

    const mailOptions = {
      from: process.env.SMTP_SIW_USER,
      to,
      subject: "Forget Password",
      text: `Your OTP for resetting your password is: ${otp}`,
      html: forgetPasswordTemplate(otp, hostname),
      //   to: "donotreply-cloustest@medtronic.com",
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("info: ", info);

    await forgetpassword(otp);
    return otp;
  } catch (error) {
    console.log("Error sending OTP email:", error);
    throw error;
  }
};

exports.findUserByEmail = async (email) => {
  try {
    const query = `SELECT * FROM organic_farmer_admin_user WHERE email = ?`;
    const [rows] = await db.promise().query(query, [email]);
    return rows[0] || null;
  } catch (error) {
    console.log("Error ", error);
    return error;
  }
};

exports.findUserOTP = async (otp) => {
  try {
    const query = `SELECT * FROM organic_farmer_admin_user WHERE otp = ?`;
    const [rows] = await db.promise().query(query, [otp]);
    return rows[0] || null;
  } catch (error) {
    console.log("error: ", error);
    throw error;
  }
};
/// Re-set password
exports.resetPassword = async (email, hashedPassword) => {
  const query = `UPDATE organic_farmer_admin_user SET password = ? ,otp = NULL WHERE email = ? `;
  const [rows] = await db.promise().query(query, [hashedPassword, email]);
  if (rows.affectedRows > 0) {
    return { message: "Password reset sucessfully" };
  }
  try {
  } catch (error) {
    console.log("Error in resetpassword:", error);
    throw error;
  }
};
