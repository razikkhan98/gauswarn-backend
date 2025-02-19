// // models/addtocartModel.js
// const { connectToDatabase } = require("../../../config/dbConnection");  

// exports.findCartItem = async (product_id, user_id) => {
//     try {
//         const connection = await connectToDatabase();
//         const query = `SELECT * FROM rajlaxmi_addtocart_table WHERE product_id = ? AND user_id = ?`;
//         const [rows] = await connection.query(query, [product_id, user_id]);
//         console.log("results: ", rows);
//         return rows;
//     } catch (error) {
//         console.log("error: ", error);
//     }
// };

// // Add a new item to the cart
// exports.addCartItem = async (cartItem) => {
//     try {
//         const {
//             user_id,
//             product_id,
//             product_price,
//             product_weight,
//             product_quantity,
//             product_total_amount,
//         } = cartItem;

//         const connection = await connectToDatabase();
//         const query = `INSERT INTO rajlaxmi_addtocart_table (
//         user_id,
//         product_id,
//         product_price,
//         product_weight,
//         product_quantity,
//         product_total_amount
//     ) VALUES (?, ?, ?, ?, ?, ?)`;

//         return new Promise((resolve, reject) => {
//             connection.execute(query,
//                 [
//                     user_id || "",
//                     product_id || "",
//                     product_price || "",
//                     product_weight || "",
//                     product_quantity || "",
//                     product_total_amount || "",
//                 ],
//                 (err, results) => {
//                     if (err) reject(err);
//                     resolve(results);
//                 }
//             );
//         });
//     } catch (error) {
//         console.log("error: ", error);
//     }
// };

// // Update the quantity and total amount of an existing cart item

// exports.updateCartItem = async (
//     user_id,
//     product_id,
//     new_quantity,
//     new_total_amount
//   ) => {
//     try {
//         const connection = await connectToDatabase();
//         const query =
//         `UPDATE rajlaxmi_addtocart_table SET product_quantity = ?, product_total_amount = ? WHERE product_id = ? AND user_id = ?`;

//       return new Promise((resolve, reject) => {
//         connection.execute(
//           query,
//           [new_quantity, new_total_amount, product_id, user_id],
//           (err, results) => {
//             if (err) reject(err);
//             resolve(results.affectedRows); // Return the number of rows affected
//           }
//         );
//       });
//     } catch (error) {
//       console.log("error: ", error);
//     }
//   };


// models/cartModel.js

// const moment = require("moment");
// const { withConnection } = require("../../../utils/helper");
const { connectToDatabase } = require("../../../config/dbConnection");

exports.findCartItem = async (product_id, user_id) => {
    try {
        // Ensure to await the query to resolve the promise
        const connection = await connectToDatabase();
        const query =
            "SELECT * FROM rajlaxmi_addtocart_table WHERE product_id = ? AND user_id = ?";
        const [rows] = await connection.execute(query, [product_id, user_id]);
        return rows;

    } catch (error) {
        try {
            console.log("results:findCartItem ", error);
            const connection = await connectToDatabase();
            const query =
                "SELECT * FROM rajlaxmi_addtocart_table WHERE product_id = ? AND user_id = ?";
            const [rows] = await connection.execute(query, [product_id, user_id]);
            return rows;

        } catch (error) {
            console.log("error:", error,);
        }

    }
};

// Add a new item to the cart

exports.addCartItem = async (cartItem) => {
    try {
        const {
            uid,
            user_id,
            product_id,
            product_price,
            product_weight,
            product_quantity,
            product_total_amount
        } = cartItem;

        const connection = await connectToDatabase();
        const query = `INSERT INTO rajlaxmi_addtocart_table (
          uid,  
          user_id,
          product_id,
          product_price,
          product_weight,
          product_quantity,
          product_total_amount
      ) VALUES (?, ?, ?, ?, ?, ?)`;

        const [results] = await connection.execute(query, [
            uid,
            user_id,
            product_id,
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


// Update the quantity and total amount of an existing cart item
exports.updateCartItem = async (
    user_id,
    product_id,
    newQuantity,
    newTotalAmount
) => {
    try {
        const connection = await connectToDatabase();
        const query =
            `UPDATE rajlaxmi_addtocart_table SET product_quantity = ?, product_total_amount = ? WHERE product_id = ? AND user_id = ?`;

        const [results] = await connection.execute(query, [
            newQuantity,
            newTotalAmount,
            product_id,
            user_id,
        ]);
        return results.affectedRows;

    } catch (error) {
        console.error("Error in updateCartItem:", error);
        throw error;
    }
};


// Function to remove an item from the cart
exports.removeFromCart = async (user_id, product_id) => {
    try {
        // Query to delete the cart item for the given product_id and user_id

        const connection = await connectToDatabase();
        const query =
            `DELETE FROM rajlaxmi_addtocart_table WHERE product_id = ? AND user_id = ?`;

        // Executing the delete query
        const [result] = await connection.execute(query, [product_id, user_id]);
        console.log("removeFromCart ", result);

        // Check if any rows were affected (i.e., if the item was deleted)
        if (result.affectedRows > 0) {
            return { message: "Product removed from cart" };
        } else {
            return { message: "No matching product found in cart" };
        }

    } catch (error) {
        console.error("Error removing product from cart:", error);
    }
};
