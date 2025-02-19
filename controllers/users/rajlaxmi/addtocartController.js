const asyncHandler = require("express-async-handler");
const addtocartModel = require("../../../model/users/rajlaxmi/addtocartModel"); 

// Add to Cart Endpoint
exports.addToCart = asyncHandler(async (req, res) => {
  const {
    uid,
    product_id,
    user_id,
    product_price,
    product_weight,
    product_quantity,
    product_total_amount,
  } = req.body;
  
  // Validate required fields
  if (
      !uid ||
      !product_id ||
      !user_id ||
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
      const cartItems = await addtocartModel.findCartItem(product_id, user_id); 
      
      if (cartItems.length  > 0) {
          
           const cartItem = cartItems[0];
     
           const newQuantity = cartItem?.product_quantity + product_quantity;
           const newTotalAmount =
             cartItem?.product_total_amount + product_total_amount;
     
           // Update the cart item in the database
           await addtocartModel.updateCartItem(
             user_id,
             product_id,
             newQuantity,
             newTotalAmount
           );
           return res.json({ message: "Product updated in cart"});
         } else {
           // If the product is not in the cart, create a new entry
           await addtocartModel.addCartItem({
             user_id,
             product_id,
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

    // Delete add to cart
     exports.removeFromCart = asyncHandler(async (req, res, next) => {
       try {
        const { product_id, user_id } = req.body;
     
        if (!product_id && !user_id) {
          return res.status(400).json({message: "Please provide all required fields"});
        }
            console.log(!product_id && !user_id)
        
            const cartItems = await addtocartModel.removeFromCart(user_id, product_id); 
            if (cartItems && cartItems.affectedRows > 0) {
                return res.status(200).json({ message: "Item removed from cart successfully" });
              } else {
                return res.status(404).json({ message: "Item not found in the cart" });
              }
        //  return res.status(201).json({ message: cartItems?.message });
       } catch (error) {
         console.error("Error removeFromCart",error);
         return res.json({message: "Server error, failed to add to cart", error});
       }
     });
     
    // Update add to cart
     exports.updateFromCart = asyncHandler(async (req, res, next) => {
       try {
         const { product_id, user_id, product_quantity, product_total_amount } = req.body;
     
         if (!product_id && !user_id) {
           return res.status(400).json({message: "Please provide all required fields updateFromCart"});
         }
     
         const [cartItem] = await addtocartModel.findCartItem(product_id, user_id);
     
         if (!cartItem) {
           return res.status(404).json({message: "Cart item not found"});
         }
     
         await addtocartModel.updateCartItem(
           user_id,
           product_id,
           product_quantity,
           product_total_amount
         );
     
         return res.json({message: "Product updated in cart"});
       } catch (error) {
         return res.json({message: "Server error, failed to update cart"});
       }
     });
     