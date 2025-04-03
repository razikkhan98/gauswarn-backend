const asyncHandler = require("express-async-handler");
const contactModel = require("../../../model/users/rajlaxmi/contactModel");
const registerModel = require("../../../model/users/rajlaxmi/registerModel");

exports.userContact = asyncHandler(async (req, res) => {
  try {
    const { uid, user_name, user_email, user_number, message } = req.body;

    // Validation
    if (!uid && !user_name && !user_email && !user_number && !message) {
      return res
        .status(400)
        .json({ message: "Please provide all fileds are required" });
    }

    // Check uid in database
    const user = await registerModel.findUserByUid(uid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // New user
    const newContact = {
      uid,
      user_name,
      user_email,
      user_number,
      message,
    };
    await contactModel.userContact(newContact);
    return res
      .status(200)
      .json({ success: true, message: "Contact successfully saved" });
  } catch (error) {
    console.error("Database Error", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});
