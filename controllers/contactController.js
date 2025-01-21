const asyncHandler = require("express-async-handler");
const contactModel = require("../model/contactController");

// Controller for handling contact form submissions
exports.contact = asyncHandler(async (req, res) => {
  try {
    const { user_name, user_email, user_mobile, user_subject, user_message } =
      req.body;

    // Validate required fields
    if (
      !user_name ||
      !user_email ||
      !user_mobile ||
      !user_subject ||
      !user_message
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Prepare new contact data
    const newContact = {
      user_name,
      user_email,
      user_mobile,
      user_subject,
      user_message,
    };

    // Save the new contact to the database
    await contactModel.contact(newContact);
    res.status(201).json({
      success: true,
      message: "Contact information has been successfully saved.",
    });
  } catch (error) {
    console.error("Database error:", error); // Log the error for debugging
    res.status(500).json({
      message: "An error occurred while saving contact information.",
      error: error.message,
    });
  }
});

// Get All contact
exports.getAllContact = async (req, res) => {
  try {
    const contact = await contactModel.getAllContact();
    res.status(200).json({ contact });
  } catch (error) {
    console.error("Error fetching contact:", error);
    res.json({ error: "Failed to fetch contact" });
  }
};
