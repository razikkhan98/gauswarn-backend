const asyncHandler = require("express-async-handler");
const contactModel = require("../../../model/users/rajlaxmi/contactModel");
const registerModel = require("../../../model/users/rajlaxmi/registerModel");

exports.userContact = asyncHandler(async (req, res) => {
  try {
    const { uid, user_name, user_email, user_number, message } = req.body;
    console.log("req.body: ", req.body);

    // Validation
    if (!uid && !user_name && !user_email && !user_number && !message) {
      return res.json({ message: "Please provide all fileds are required" });
    }

    // Check uid in database
    const user = await registerModel.findUserByUid(uid);
    if (!user) {
      return res.json({ message: "User not found" });
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
    return res.json({ success: true, message: "Contact successfully saved" });
  } catch (error) {
    console.error("Database Error", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// admin

exports.getAllTotalContacts = async (req, res) => {
  try {
    const total_contacts = await contactModel.getAllContactRajlaxmi();

    res.json({
      success: true,
      total_contacts,
    });
  } catch (error) {
    console.error("Error in  Total Contact Rajlaxmi", error);
    res.json({
      success: false,
      error: error.message,
    });
  }
};
