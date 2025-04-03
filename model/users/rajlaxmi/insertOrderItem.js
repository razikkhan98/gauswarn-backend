const { connectToDatabase } = require("../../../config/dbConnection");

// ✅ Insert Order Item
const insertOrderItem = async (
  order_id,
  uid,
  product_id,
  product_name,
  product_price,
  product_weight,
  product_quantity,
  product_total_amount
) => {
  try {
    const connection = await connectToDatabase();
    const query = `
      INSERT INTO rajlaxmi_orders 
      (order_id, uid, product_id, product_name, product_price, product_weight, product_quantity, product_total_amount, order_status, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Processing', NOW())
    `;

    const [result] = await connection.execute(query, [
      order_id,
      uid,
      product_id,
      product_name,
      product_price,
      product_weight,
      product_quantity,
      product_total_amount
    ]);

    return result.affectedRows > 0; // ✅ Returns true if successful
  } catch (error) {
    console.error("❌ Error inserting order item:", error);
    return false;
  }
};

// ✅ Delete Cart Items
const deleteCartItems = async (uid) => {
  try {
    const connection = await connectToDatabase();
    const query = `DELETE FROM rajlaxmi_addtocart WHERE uid = ?`;
    
    const [result] = await connection.execute(query, [uid]);

    return result.affectedRows > 0; // ✅ Returns true if successful
  } catch (error) {
    console.error("❌ Error deleting cart items:", error);
    return false;
  }
};

// ✅ Export functions for use in other files
module.exports = {
  insertOrderItem,
  deleteCartItems
};
