const asyncHandler = require("express-async-handler");
const addtocartModel = require("../../../model/users/rajlaxmi/addtocartModel"); 

// Add to Cart Endpoint
exports.addToCart = asyncHandler(async (req, res) => {
  const {
    uid,
    product_id,
    product_name,
    product_price,
    product_weight,
    product_quantity,
    product_total_amount,
  } = req.body;
  
  // Validate required fields
  if (
      !uid ||
      !product_id ||
      !product_name ||
      !product_price ||
      !product_weight ||
      !product_quantity ||
      !product_total_amount
    ) {
        return res.status(400)
        .json({ message: "Please provide all required fields" });
  }
  
  try {
      // Check if the product is already in the user's cart
      const cartItems = await addtocartModel.findCartItem(product_id, uid); 
      
      if (cartItems.length  > 0) {
          
           const cartItem = cartItems[0];
     
           const newQuantity = cartItem?.product_quantity + product_quantity;
           const newTotalAmount =
             cartItem?.product_total_amount + product_total_amount;
     
           // Update the cart item in the database
           await addtocartModel.updateCartItem(
             uid,
             product_id,
             product_name,
             newQuantity,
             newTotalAmount
           );
           return res.json({ message: "Product updated in cart"});
         } else {
           
          // If the product is not in the cart, create a new entry
           await addtocartModel.addCartItem({
             uid,
             product_id,
             product_name,
             product_price,
             product_weight,
             product_quantity,
             product_total_amount
           });
           return res.status(201).json({message: "Product added to cart"});
         }
       } catch (error) {        
        console.error("Database error:", error);  
        res.json({message: "Server error, failed to add to cart",error});
    }
     });




    // Update add to cart
     exports.updateFromCart = asyncHandler(async (req, res) => {
       try {
         const { uid, product_id, product_name, product_quantity, product_total_amount } = req.body;
         
         if (!uid || !product_id || !product_name || !product_quantity || !product_total_amount ) { 
           return res.status(400).json({message: "Please provide all required fields "});
          }
          const cartItem = await addtocartModel.findCartItem({uid, product_id});  
          console.log(cartItem)
          
          if (!cartItem) {
            return res.status(400).json({message: "Cart item not found"});
          }
          console.log(cartItem)
          
          const affectedRows = await addtocartModel.updateCartItem(
            uid,
            product_id,
            product_name,
            product_quantity,
            product_total_amount
          );

          if (affectedRows > 0) {
          return res.status(200).json({ message: "Product updated in cart" });
        } else {
          return res.status(400).json({ message: "Failed to update cart item" });
        }
     
       } catch (error) {
        console.error("Error update cart items", error);
         return res.json({message: "Server error, failed to update cart"});
       }
     });




         // Delete add to cart
         exports.removeFromCart = asyncHandler(async (req, res, next) => {
          try {
           const {uid , product_id } = req.body;  
        
           if (!uid || !product_id ) {
             return res.status(400).json({message: "Please provide all required fields"});
           }
           
           const response = await addtocartModel.removeFromCart(uid, product_id);
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
            console.error("Error removeFromCart",error);
            return res.json({message: "Server error, failed to add to cart", error});
          }
        });
        
     