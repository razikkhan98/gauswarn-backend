// exports.processOrderAfterPayment = async (uid) => {
//     try {
//       // Get all cart items for the user
//       const cartItems = await addtocartModel.getCartItems(uid);
  
//       if (!cartItems || cartItems.length === 0) {
//         console.log("No items in cart to place order.");
//         return;
//       }
  
//       // Generate a unique order ID
//       const order_id = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  
//       // Insert cart items into orders table
//       for (let item of cartItems) {
//         await orderModel.insertOrderItem(
//           order_id,
//           uid,
//           item.product_id,
//           item.product_name,
//           item.product_price,
//           item.product_weight,
//           item.product_quantity,
//           item.product_total_amount
//         );
//       }
  
//       // Delete cart items after successful order creation
//       await addtocartModel.deleteCartItems(uid);
  
//       console.log("Order placed successfully and cart cleared.");
//     } catch (error) {
//       console.error("Error processing order after payment:", error);
//     }
//   };
  
const addtocartModel = require("../model/users/rajlaxmi/addtocartModel");
const orderModel = require("../model/users/rajlaxmi/insertOrderItem");

exports.processOrderAfterPayment = async (uid) => {
    try {
      // Fetch user's cart items
      const cartItems = await addtocartModel.getCartItemsByUserId(uid);
  
      if (!cartItems || cartItems.length === 0) {
        console.log("No items in cart to place order.");
        return;
      }
  
      // Generate a unique order ID
      const order_id = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  
      // Track successful inserts
      let orderSuccess = true;
  
      // Insert each cart item into the order table
      for (let item of cartItems) {
        const success = await orderModel.insertOrderItem(
          order_id,
          uid,
          item.product_id,
          item.product_name,
          item.product_price,
          item.product_weight,
          item.product_quantity,
          item.product_total_amount
        );
  
        if (!success) {
          orderSuccess = false;
          console.error(`Failed to insert product ${item.product_id} into orders.`);
        }
      }
  
      // ✅ Delete cart items **only if** all insertions were successful
      if (orderSuccess) {
        await orderModel.deleteCartItems(uid);
        console.log("Order placed successfully and cart cleared.");
      } else {
        console.error("Order failed for some items. Cart not cleared.");
      }
  
    } catch (error) {
      console.error("Error processing order after payment:", error);
    }
  };
  