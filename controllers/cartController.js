const asyncHandler = require("express-async-handler");
const cartModel = require("../model/cartModel"); // Make sure to import your cart model

// Add to Cart Endpoint
exports.addToCart = asyncHandler(async (req, res) => {
  const {
    product_id,
    user_id,
    product_price,
    product_weight,
    product_quantity,
    product_total_amount,
  } = req.body;

  // Validate required fields
  if (
    !product_id ||
    !user_id ||
    !product_price ||
    !product_weight ||
    !product_quantity ||
    !product_total_amount
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  try {
    // Check if the product is already in the user's cart
    console.log("product_id: ", product_id);
    const cartItems = await cartModel.findCartItem(product_id, user_id); // Assuming it returns an array
    console.log("cartItems:----- ", cartItems);

    if (cartItems.length > 0) {
      // If the product is already in the cart (cartItems is an array)
      const cartItem = cartItems[0]; // Access the first item if only one is expected

      const newQuantity = cartItem?.product_quantity + product_quantity;
      const newTotalAmount =
        cartItem?.product_total_amount + product_total_amount;

      // Update the cart item in the database
      await cartModel.updateCartItem(
        user_id,
        product_id,
        newQuantity,
        newTotalAmount
      );
      return res.json({ message: "Product updated in cart" });
    } else {
      // If the product is not in the cart, create a new entry
      await cartModel.addCartItem({
        user_id,
        product_id,
        product_price,
        product_weight,
        product_quantity,
        product_total_amount,
      });
      return res.status(201).json({ message: "Product added to cart" });
    }
  } catch (error) {
    // Catch any errors and send an appropriate response
    console.error("Error while adding to cart:", error);
    return res
      .status(500)
      .json({ message: "Server error, failed to add to cart" });
  }
});

exports.removeFromCart = asyncHandler(async (req, res) => {
  try {
    const { product_id, user_id } = req.query;
    console.log("user_id: ", user_id);
    console.log("product_id: ", product_id);

    // Validate required fields
    if (!product_id || !user_id) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }
    const cartItems = await cartModel.removeFromCartModal(user_id, product_id); // Assuming it returns an array

    return res.status(201).json({ message: cartItems?.message });
  } catch (error) {
    // Catch any errors and send an appropriate response
    console.error("Error while adding to cart:", error);
    return res
      .status(500)
      .json({ message: "Server error, failed to add to cart" });
  }
});


// exports.updateFromCart = asyncHandler(async (req, res) => {

//   try {
//     const { product_id, user_id, product_quantity, product_total_amount, change } = req.body;

//     console.log("user_id:", user_id, "product_id:", product_id);

//     // Validate required fields
//     if (!product_id || !user_id) {
//       return res.status(400).json({ message: "Please provide all required fields" });
//     }

//     // Fetch cart item
//     const [cartItem] = await cartModel.findCartItem(product_id, user_id); // Destructure the first item

//     if (!cartItem) {
//       return res.status(404).json({ message: "Cart item not found" });
//     }

//     // Calculate new total amount based on change
//     const amountChange = change === -1 
//       ? -product_total_amount 
//       : change === 1 
//         ? product_total_amount 
//         : 0;

//     const newTotalAmount = (cartItem.product_total_amount || 0) + amountChange;

//     // Update cart item in the database
//     await cartModel.updateCartItem(
//       user_id,
//       product_id,
//       product_quantity,
//       newTotalAmount
//     );

//     return res.json({ message: "Product updated in cart" });
//   } catch (error) {
//     console.error("Error while adding to cart:", error);
//     return res.status(500).json({ message: "Server error, failed to add to cart" });
//   }
// });



exports.updateFromCart = asyncHandler(async (req, res) => {
  try {
    const { product_id, user_id, product_quantity, product_total_amount } = req.body;

    console.log("user_id:", user_id, "product_id:", product_id);

    if (!product_id && !user_id) {
      return res.status(400).json({ message: "Please provide all required fields updateFromCart" });
    }

    const [cartItem] = await cartModel.findCartItem(product_id, user_id);

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await cartModel.updateCartItem(
      user_id,
      product_id,
      product_quantity,
      product_total_amount
    );

    return res.json({ message: "Product updated in cart" });
  } catch (error) {
    console.error("Error while updating cart:", error);
    return res.status(500).json({ message: "Server error, failed to update cart" });
  }
});
