// models/cartModel.js
const { connectToDatabase } = require("../../../config/dbConnection");

// Check if cart item exists
exports.findCartItem = async (product_id, uid) => {
    // console.log('uid: ', uid);
    // console.log('product_id: ', product_id);
    // // if (product_id === undefined || uid === undefined) {
    // //     throw new Error('Product ID or UID cannot be undefined');
    // // }
    try {
      const connection = await connectToDatabase();
      const query =`SELECT * FROM rajlaxmi_addtocart WHERE product_id = ? AND uid = ?`;
        const [rows] = await connection.execute(query, [product_id, uid ]);
       return rows.length>0 ? rows[0]: null;
    } catch (error) {
        console.error("Error in findCartItem:", error);
        throw error; 
  
    }
    // finally {
    //     if (connection) {
    //       connection.release(); // If using a pool, release the connection
    //     }
    // }
  };

// Add a new item to the cart
exports.addCartItem = async (cartItem) => {
    try {
        const {
            uid,
            product_id,
            product_name,
            product_price,
            product_weight,
            product_quantity,
            product_total_amount
        } = cartItem;

        
        const connection = await connectToDatabase();
        const query = `INSERT INTO rajlaxmi_addtocart (
          uid,  
          product_id,
          product_name,
          product_price,
          product_weight,
          product_quantity,
          product_total_amount
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const [results] = await connection.execute(query, [
            uid,
            product_id,
            product_name,
            product_price,
            product_weight,
            product_quantity,
            product_total_amount
        ]);
        return results;

    } catch (error) {
        console.error("Error in addCartItem:", error);
        throw error;
    }
};



// Update cart item
exports.updateCartItem = async (
    uid,
    product_id,
    product_name,
    newQuantity,
    newTotalAmount
) => {
    
    try {
        const connection = await connectToDatabase();
        
        const query =
            `UPDATE rajlaxmi_addtocart 
            SET product_quantity = ?, product_total_amount = ? WHERE product_id = ? AND uid = ? AND product_name = ?`;

        const [results] = await connection.execute(query, [
            newQuantity,
            newTotalAmount,
            product_id,
            product_name,
            uid,
        ]);
        return results.affectedRows;

    } catch (error) {
        console.error("Error in updateCartItem:", error);
        throw error;
    } finally {
        if (connection) {
          connection.release(); // If using a pool, release the connection
        }
      }
};


// Function to remove an item from the cart
exports.removeFromCart = async (uid, product_id) => {
    try {
        const connection = await connectToDatabase();
        const query =
            `DELETE FROM rajlaxmi_addtocart WHERE product_id = ? AND uid = ?`;

        const [result] = await connection.execute(query, [uid, product_id]);
        console.log("removeFromCart ", result);

        if (result.affectedRows > 0) {
            return { message: "Product removed from cart" };
        } else {
            return { message: "No matching product in cart" };
        }

    } catch (error) {
        console.error("Error removing product from cart:", error);
        throw error;
    }
};


// Get All Carts
exports.getAllCarts = async () => {
    try {
        const connection = await connectToDatabase();
        const query = "SELECT * FROM rajlaxmi_addtocart";
        const [carts] = await connection.execute(query);
        return carts;
      
    } catch (error) {
      throw new Error(error.message);
    }
  };