const asyncHandler = require("express-async-handler");
const addtocartModel = require("../../../model/users/rajlaxmi/addtocartModel");
const registerModel = require("../../../model/users/rajlaxmi/registerModel");

// Add to Cart Endpoint
exports.addToCart = asyncHandler(async (req, res) => {
  try {
    const {
      uid,
      product_id,
      product_name,
      product_price,
      product_weight,
      product_quantity,
    } = req.body;

    if (
      !uid ||
      !product_id ||
      !product_name ||
      !product_price ||
      !product_weight ||
      !product_quantity
    ) {
      return res
        .status(400)
        .json({ message: "Missing required fields in cart item" });
    }

    // Check uid in database
    const user = await registerModel.findUserByUid(uid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the product already exists in the cart
    const cartItems = await addtocartModel.findCartItem(product_id, uid);

    if (cartItems?.length > 0) {
      // If product exists, update quantity and total amount
      const cartItem = cartItems[0];
      const newQuantity = cartItem.product_quantity + product_quantity;
      const newTotalAmount =
        cartItem.product_total_amount + product_price * product_quantity;

      await addtocartModel.updateCartItem(
        uid,
        product_id,
        newQuantity,
        newTotalAmount
      );
    } else {
      // If product does not exist, insert a new row
      await addtocartModel.addCartItem({
        uid,
        product_id,
        product_name,
        product_price,
        product_weight,
        product_quantity,
        product_total_amount: product_price * product_quantity,
      });
    }

    res.status(200).json({ message: "Cart updated successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res
      .status(500)
      .json({ message: "Server error, failed to add to cart", error });
  }
});

// Update add to cart
exports.updateCartItem = asyncHandler(async (req, res) => {
  try {
    const {
      uid,
      product_id,
      product_name,
      product_quantity,
      product_weight,
      product_price,
      product_total_amount,
    } = req.body;
    if (
      !uid ||
      !product_id ||
      !product_name ||
      !product_quantity ||
      !product_weight ||
      !product_price ||
      !product_total_amount
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields " });
    }

    // Check uid in database
    const user = await registerModel.findUserByUid(uid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItem = await addtocartModel.findCartItem(product_id, uid);

    if (!cartItem) {
      return res.status(400).json({ message: "Cart item not found" });
    }

    const affectedRows = await addtocartModel.updateCartItem(
      uid,
      product_id,
      product_name,
      product_quantity,
      product_weight,
      product_price,
      product_total_amount
    );

    if (affectedRows > 0) {
      return res.status(200).json({ message: "Product updated in cart" });
    } else {
      return res.status(400).json({ message: "Failed to update cart item" });
    }
  } catch (error) {
    console.error("Error update cart items", error);
    return res
      .status(500)
      .json({ message: "Server error, failed to update cart" });
  }
});

// Delete add to cart
exports.deleteCartItem = asyncHandler(async (req, res, next) => {
  try {
    const { uid, product_id } = req.body;

    if (!uid || !product_id) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }
    // Check uid in database
    const user = await registerModel.findUserByUid(uid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const response = await addtocartModel.removeFromCart(product_id, uid);
    //  return res.json(response);

    if (response && response.message) {
      return res.status(200).json({ message: response.message });
    } else {
      return res.status(404).json({ message: "Item not found in the cart" });
    }

    // const cartItems = await addtocartModel.removeFromCart(uid, product_id);
    // if (cartItems && cartItems.affectedRows > 0) {
    //     return res.status(200).json({ message: "Item removed from cart successfully" });
    //   } else {
    //     return res.status(404).json({ message: "Item not found in the cart" });
    //   }
    //  return res.status(201).json({ message: cartItems?.message });
  } catch (error) {
    console.error("Error removeFromCart", error);
    return res.json({ message: "Server error, failed to add to cart", error });
  }
});

// Get All Products
exports.getAllCarts = async (req, res) => {
  try {
    const addtocart = await addtocartModel.getAllCarts();

    res.status(200).json({ addtocart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.json({ error: "Failed to fetch cart" });
  }
};
