// models/cartModel.js

const db = require("../config/dbConnection"); // MySQL database connection

// Find a cart item by product_id and user_id

exports.findCartItem = async (product_id, user_id) => {
  try {
    // Ensure to await the query to resolve the promise
    const query =
      "SELECT * FROM organic_farmer_table_addtocart WHERE product_id = ? AND user_id = ?";
    const [rows] = await db.promise().query(query, [product_id, user_id]);

    // Log the results for debugging purposes
    console.log("results: ", rows);

    // Return the results (assuming you want the first row)
    return rows;
  } catch (error) {
    // Log any errors that occur during the query execution
    console.log("error: ", error);
  }
};

// Add a new item to the cart

exports.addCartItem = async (cartItem) => {
  try {
    const {
      user_id,
      product_id,
      product_price,
      product_weight,
      product_quantity,
      product_total_amount,
    } = cartItem;

    const query =
      "INSERT INTO organic_farmer_table_addtocart (user_id, product_id, product_price,product_weight, product_quantity, product_total_amount) VALUES (?, ?, ?, ?, ?,?)";

    return new Promise((resolve, reject) => {
      db.execute(
        query,
        [
          user_id || "",
          product_id || "",
          product_price || "",
          product_weight || "",
          product_quantity || "",
          product_total_amount || "",
        ],
        (err, results) => {
          if (err) reject(err);
          resolve(results); // Return the ID of the inserted item
        }
      );
    });
  } catch (error) {
    console.log("error: ", error);
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
    const query =
      "UPDATE organic_farmer_table_addtocart SET product_quantity = ?, product_total_amount = ? WHERE product_id = ? AND user_id = ?";

    return new Promise((resolve, reject) => {
      db.execute(
        query,
        [newQuantity, newTotalAmount, product_id, user_id],
        (err, results) => {
          if (err) reject(err);
          resolve(results.affectedRows); // Return the number of rows affected
        }
      );
    });
  } catch (error) {
    console.log("error: ", error);
  }
};

// Function to remove an item from the cart

exports.removeFromCartModal = async (user_id, product_id) => {
  try {
    // Query to delete the cart item for the given product_id and user_id
    const query =
      "DELETE FROM organic_farmer_table_addtocart WHERE product_id = ? AND user_id = ?";

    // Executing the delete query
    const [result] = await db.promise().query(query, [product_id, user_id]);
    console.log('result: ', result);

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
