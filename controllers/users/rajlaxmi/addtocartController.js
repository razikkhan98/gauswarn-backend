// const asyncHandler = require("express-async-handler");
// const addtocartModel = require("../../../model/users/rajlaxmi/addtocartModel");
// const registerModel = require("../../../model/users/rajlaxmi/registerModel");

// // Add to Cart Endpoint
// exports.addToCart = asyncHandler(async (req, res) => {
//   try {
//     const {
//       uid,
//       product_id,
//       product_name,
//       product_price,
//       product_weight,
//       product_quantity,
//     } = req.body;

//     if (
//       !uid ||
//       !product_id ||
//       !product_name ||
//       !product_price ||
//       !product_weight ||
//       !product_quantity
//     ) {
//       return res
//         .status(400)
//         .json({ message: "Missing required fields in cart item" });
//     }

//     // Check uid in database
//     const user = await registerModel.findUserByUid(uid);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Check if the product already exists in the cart
//     const cartItems = await addtocartModel.findCartItem(product_id, uid);

//     if (cartItems?.length > 0) {
//       // If product exists, update quantity and total amount
//       const cartItem = cartItems[0];
//       const newQuantity = cartItem.product_quantity + product_quantity;
//       const newTotalAmount =
//         cartItem.product_total_amount + product_price * product_quantity;

//       await addtocartModel.updateCartItem(
//         uid,
//         product_id,
//         newQuantity,
//         newTotalAmount
//       );
//     } else {
//       // If product does not exist, insert a new row
//       await addtocartModel.addCartItem({
//         uid,
//         product_id,
//         product_name,
//         product_price,
//         product_weight,
//         product_quantity,
//         product_total_amount: product_price * product_quantity,
//       });
//     }

//     res.status(200).json({ message: "Add to cart successfully" });
//   } catch (error) {
//     console.error("Database error:", error);
//     res
//       .status(500)
//       .json({ message: "Server error, failed to add to cart", error });
//   }
// });

// // Update add to cart
// exports.updateCartItem = asyncHandler(async (req, res) => {
//   try {
//     const {
//       uid,
//       product_id,
//       product_name,
//       product_quantity,
//       product_weight,
//       product_price,
//     } = req.body;
//     if (
//       !uid ||
//       !product_id ||
//       !product_name ||
//       !product_quantity ||
//       !product_weight ||
//       !product_price 
      
//     ) {
//       return res
//         .status(400)
//         .json({ message: "Please provide all required fields " });
//     }

//     // Check uid in database
//     const user = await registerModel.findUserByUid(uid);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const cartItem = await addtocartModel.findCartItem(product_id, uid);

//     if (!cartItem) {
//       return res.status(400).json({ message: "Cart item not found" });
//     }

//     const affectedRows = await addtocartModel.updateCartItem(
//       uid,
//       product_id,
//       product_name,
//       product_quantity,
//       product_weight,
//       product_price,
//       product_total_amount
//     );

//     if (affectedRows > 0) {
//       return res.status(200).json({ message: "Product updated in cart" });
//     } else {
//       return res.status(400).json({ message: "Failed to update cart item" });
//     }
//   } catch (error) {
//     console.error("Error update cart items", error);
//     return res
//       .status(500)
//       .json({ message: "Server error, failed to update cart" });
//   }
// });

// // Delete add to cart
// exports.deleteCartItem = asyncHandler(async (req, res, next) => {
//   try {
//     const { uid, product_id } = req.body;

//     if (!uid || !product_id) {
//       return res
//         .status(400)
//         .json({ message: "Please provide all required fields" });
//     }
//     // Check uid in database
//     const user = await registerModel.findUserByUid(uid);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const response = await addtocartModel.removeFromCart(product_id, uid);
//     //  return res.json(response);

//     if (response && response.message) {
//       return res.status(200).json({ message: response.message });
//     } else {
//       return res.status(404).json({ message: "Item not found in the cart" });
//     }

//   } catch (error) {
//     console.error("Error removeFromCart", error);
//     return res.json({ message: "Server error, failed to add to cart", error });
//   }
// });

// // Get All Products
// exports.getAllCarts = async (req, res) => {
//   try {
//     const addtocart = await addtocartModel.getAllCarts();

//     res.status(200).json({ addtocart });
//   } catch (error) {
//     console.error("Error fetching cart:", error);
//     res.json({ error: "Failed to fetch cart" });
//   }
// };



const asyncHandler = require("express-async-handler");
const addtocartModel = require("../../../model/users/rajlaxmi/addtocartModel");
const registerModel = require("../../../model/users/rajlaxmi/registerModel");

// Add to Cart
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

    if (!uid || !product_id || !product_name || !product_price || !product_weight || !product_quantity) {
      return res.status(400).json({ message: "Missing required fields in cart item" });
    }

    // Validate user
    const user = await registerModel.findUserByUid(uid);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if the product already exists in the cart
    const cartItem = await addtocartModel.findCartItem(product_id, uid);

    if (cartItem) {
      const newQuantity = cartItem.product_quantity + product_quantity;
      const newTotalAmount = cartItem.product_price * newQuantity;

      await addtocartModel.updateCartItem(uid, product_id, newQuantity, newTotalAmount);
    } else {
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

    res.status(200).json({ message: "Added to cart successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Server error, failed to add to cart", error });
  }
});

// Update Cart Item
exports.updateCartItem = asyncHandler(async (req, res) => {
  try {
    const { uid, product_id, product_quantity, product_price } = req.body;

    if (!uid || !product_id || !product_quantity || !product_price) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Validate user
    const user = await registerModel.findUserByUid(uid);
    if (!user) return res.status(404).json({ message: "User not found" });

    const cartItem = await addtocartModel.findCartItem(product_id, uid);
    if (!cartItem) return res.status(404).json({ message: "Cart item not found" });

    const product_total_amount = product_price * product_quantity;
    const updated = await addtocartModel.updateCartItem(uid, product_id, product_quantity, product_total_amount);

    if (updated) {
      res.status(200).json({ message: "Cart item updated successfully" });
    } else {
      res.status(400).json({ message: "Failed to update cart item" });
    }
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Server error, failed to update cart item" });
  }
});

// Delete Cart Item
exports.deleteCartItem = asyncHandler(async (req, res) => {
  try {
    const { uid, product_id } = req.body;

    if (!uid || !product_id) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Validate user
    const user = await registerModel.findUserByUid(uid);
    if (!user) return res.status(404).json({ message: "User not found" });

    const deleted = await addtocartModel.deleteCartItem(uid, product_id);
    if (deleted) {
      res.status(200).json({ message: "Product removed from cart" });
    } else {
      res.status(404).json({ message: "Item not found in the cart" });
    }
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ message: "Server error, failed to remove cart item" });
  }
});

// Get All Cart Items
exports.getAllCarts = asyncHandler(async (req, res) => {
  try {
    const cartItems = await addtocartModel.getAllCarts();
    res.status(200).json({ cartItems });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Failed to fetch cart items" });
  }
});

// Get Cart Items by User ID
exports.getCartItemsByUser = asyncHandler(async (req, res) => {
  try {
    const { uid } = req.query;
    if (!uid) return res.status(400).json({ message: "User ID is required" });

    const cartItems = await addtocartModel.getCartItemsByUserId(uid);
    res.status(200).json({ cartItems });
  } catch (error) {
    console.error("Error fetching cart for user:", error);
    res.status(500).json({ message: "Failed to fetch user cart items" });
  }
});
