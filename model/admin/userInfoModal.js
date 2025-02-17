const { withConnection } = require("../../utils/helper");

// Fetch all getAllUserInfo reviews Ghee-web-app single-page payment-table
exports.getAllUserInfo = async () => {
  try {
    return await withConnection(async (connection) => {
      const query =
        "SELECT user_id, user_name, user_email, user_state, user_city, user_country, user_house_number, user_landmark, user_pincode, user_mobile_num, date, time FROM `organic_farmer_table_payment`";
      const [rows] = await connection.execute(query);
      return rows;
    });
  } catch (error) {
    console.log("error: ", error);
    throw error;
  }
};

// Fetch all getAllUserInfo Ghee-web-app single-page payment-table
exports.getAllOrderDetails = async () => {
  try {
    return await withConnection(async (connection) => {
      const query =
        "SELECT user_id, user_name, user_email, user_state, user_city, user_country, user_house_number, user_landmark, user_pincode, user_mobile_num, user_total_amount, status, paymentDetails, isPaymentPaid, id, date, time FROM `organic_farmer_table_payment`";
      const [rows] = await connection.execute(query);
      return rows;
    });
  } catch (error) {
    console.log("error:getAllOrderDetails ", error);
    throw error;
  }
};
