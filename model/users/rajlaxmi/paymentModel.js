// paymentModel
 
const { withConnection } = require("../../../utils/helper");

exports.userPayment = async (payment) => {
  const {
    uid,
    user_name,
    user_number,
    user_email,
    user_state,
    user_city,
    user_country,
    user_landmark,
    user_house_number,
    user_total_amount,
    purchase_price,
    product_quantity,
  } = payment;

  // Insert query
  const query = `INSERT INTO rajlaxmi_payment (
        uid,
        user_name,
        user_email,
        user_number,
        user_state,
        user_city,
        user_country,
        user_landmark,
        user_house_number,
        user_total_amount,
        purchase_price,
        product_quantity
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  try {
    
    const [results] = await withConnection(async (connection) => {
      return connection.execute(query, [
        uid,
        user_name,
        user_number,
        user_email,
        user_state,
        user_city,
        user_country,
        user_landmark,
        user_house_number,
        user_total_amount,
        purchase_price,
        product_quantity,
      ]);
    });

    return results; 
  
  } catch (error) {
    console.error("Error during payment insert:", error);
    throw error; 
  }
};
