// Get All Products

const adminUserInfoModal = require("../../model/admin/userInfoModal");
const asyncHandler = require("express-async-handler");

exports.getAllUserInfo = asyncHandler(async (req, res) => {
  try {
    const userInfo = await adminUserInfoModal.getAllUserInfo();
    res.json({ total_users: userInfo?.length });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.json({ error: "Failed to fetch products" });
  }
});

// get user details by payment table
exports.getAllOrderDetails = asyncHandler(async (req, res) => {
  try {
    const orderDetails = await adminUserInfoModal.getAllOrderDetails();
    res.json({ total_order: orderDetails?.length });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.json({ error: "Failed to fetch products" });
  }
});
