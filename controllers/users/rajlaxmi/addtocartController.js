const asyncHandler = require("express-async-handler");
const addtocartModel = require("../../../model/users/rajlaxmi/addtocartModel");

// Add to Cart Endpoint
// exports.addToCart = asyncHandler(async (req, res) => {
//   const {
//     uid,
//     product_id,
//     product_name,
//     product_price,
//     product_weight,
//     product_quantity,
//     product_total_amount,
//   } = req.body;
//   // Validate required fields
//   if (
//     !uid ||
//     !product_id ||
//     !product_name ||
//     !product_price ||
//     !product_weight ||
//     !product_quantity ||
//     !product_total_amount
//   ) {
//     return res
//       .status(400)
//       .json({ message: "Please provide all required fields" });
//   }

//   try {
//     // Check if the product is already in the user's cart
//     const cartItems = await addtocartModel.findCartItem(product_id, uid);
//     console.log("cartItems: ", cartItems);

//     if (Array.isArray(cartItems) && cartItems.length > 0) {
//       const cartItem = cartItems[0];

//       const newQuantity = (cartItem?.product_quantity || 0) + product_quantity;
//       const newTotalAmount =
//         (cartItem?.product_total_amount || 0) + product_total_amount;

//       // console.log("newQuantity" ,newQuantity);
//       // console.log("newTotalAmount" ,newTotalAmount);

//       // Update the cart item in the database
//       const updateItem = await addtocartModel.updateCartItem(
//         uid,
//         product_id,
//         product_name,
//         newQuantity,
//         newTotalAmount
//       );
//       return res.json({ message: "Product updated in cart" });
//     } else {
//       // If the product is not in the cart, create a new entry
//       const addNewCart = await addtocartModel.addCartItem({
//         uid,
//         product_id,
//         product_name,
//         product_price,
//         product_weight,
//         product_quantity,
//         product_total_amount,
//       });
//       console.log(addNewCart);
//       //  await addtocartModel.addToCart(addNewCart);
//       return res.status(201).json({ message: "Product added to cart" });
//     }
//   } catch (error) {
//     console.error("Database error:", error);
//     res.json({ message: "Server error, failed to add to cart", error });
//   }
// });


// Add to Cart Endpoint
exports.addToCart = asyncHandler(async (req, res) => {

  if (!Array.isArray(req.body) || req.body.length === 0) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  try {
    // Loop through each product in the request body
    for (const item of req.body) {
      const { uid, product_id, product_name, product_price, product_weight, product_quantity } = item;

      if (!uid || !product_id || !product_name || !product_price || !product_weight || !product_quantity) {
        return res.status(400).json({ message: "Missing required fields in cart item" });
      }

      // Check if the product already exists in the cart
      const cartItems = await addtocartModel.findCartItem(product_id, uid);

      if (cartItems?.length > 0) {
        // If product exists, update quantity and total amount
        const cartItem = cartItems[0];
        const newQuantity = cartItem.product_quantity + product_quantity;
        const newTotalAmount = cartItem.product_total_amount + product_price * product_quantity;

        await addtocartModel.updateCartItem(uid, product_id, newQuantity, newTotalAmount);
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
    }

    res.status(200).json({ message: "Cart updated successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Server error, failed to add to cart", error });
  }
});


// Update add to cart
exports.updateFromCart = asyncHandler(async (req, res) => {
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
    const cartItem = await addtocartModel.findCartItem(product_id, uid);
    console.log(cartItem);

    if (!cartItem) {
      return res.status(400).json({ message: "Cart item not found" });
    }
    console.log(!cartItem);

    const affectedRows = await addtocartModel.updateCartItem(
      uid,
      product_id,
      product_name,
      product_quantity,
      product_weight,
      product_price,
      product_total_amount,
    );

    console.log("affectedRows", affectedRows);

    if (affectedRows > 0) {
      return res.status(200).json({ message: "Product updated in cart" });
    } else {
      return res.status(400).json({ message: "Failed to update cart item" });
    }
  } catch (error) {
    console.error("Error update cart items", error);
    return res.status(500).json({ message: "Server error, failed to update cart" });
  }
});

// Delete add to cart
exports.removeFromCart = asyncHandler(async (req, res, next) => {
  try {
    const { uid, product_id } = req.body;

    if (!uid || !product_id) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
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
