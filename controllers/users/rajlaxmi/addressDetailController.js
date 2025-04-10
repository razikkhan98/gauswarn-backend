const {
  addAddressDetails,
  getAllAddressDetails,
  getAddressDetailsById,
  updateAddressDetails,
  deleteAddressDetails,
} = require("../../../model/users/rajlaxmi/addressDetailModal");

exports.addAddress = async (req, res) => {
  try {
    const data = req.body;

    const requiredFields = [
      "full_name",
      "email",
      "address",
      "house_no",
      "country",
      "contact_no",
      "state",
      "city",
      "pincode",
      "user_id",
    ];

    for (const field of requiredFields) {
      if (!data[field])
        return res.json({ success: false, message: `${field} is required` });
    }

    const addressDetails = await getAddressDetailsById(data?.user_id);
    console.log("addressDetails: ", addressDetails);

    if (addressDetails?.length === 3)
      return res.json({
        success: false,
        message: "Please remove your existing address details",
      });

    const addAddress = await addAddressDetails(data);
    res.json({
      success: true,
      message: "Address Details added successfully",
      addAddress,
    });
  } catch (error) {
    console.error("Error:", error);
    res.json({ success: false, message: "Failed to create address details" });
  }
};

exports.getAllAddress = async (req, res) => {
  try {
    const users = await getAllAddressDetails();
    res.json(users);
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch address details" });
  }
};

exports.getAllAddressDetailsById = async (req, res) => {
  try {
    const { user_id } = req.query;
    const user = await getAddressDetailsById(user_id);
    if (!user)
      return res.json({ success: true, message: "Address Details not found" });
    res.json(user);
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch address details" });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { data } = req.body;
    const updated = await updateAddressDetails(data);
    if (!updated)
      return res.json({ message: "Address Details not found or not updated" });
    res.json({
      success: true,
      message: "Address Details updated successfully",
    });
  } catch (error) {
    res.json({ success: false, message: "Failed to update address details" });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const { id, user_id } = req.body;
    const deleted = await deleteAddressDetails(id, user_id);
    if (!deleted)
      return res.json({ success: true, message: "Address Details not found" });
    res.json({
      success: true,
      message: "Address Details deleted successfully",
    });
  } catch (error) {
    res.json({ success: false, message: "Failed to delete address details" });
  }
};
