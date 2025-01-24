const { withConnection } = require("../utils/helper");

exports.addOfflineCustomer = async (
  customerName,
  customerEmail,
  customerMobile,
  productPrice,
  productQuantity,
  productWeight
) => {
  try {
    return await withConnection(async (connection) => {
      const query = `
        INSERT INTO organic_farmer_offline_customer_table (
          customer_name,
          customer_email,
          customer_mobile,
          product_price,
          product_quantity,
          product_weight
        ) VALUES (?, ?, ?, ?, ?, ?)`;

      const [result] = await connection.execute(query, [
        customerName,
        customerEmail,
        customerMobile,
        productPrice,
        productQuantity,
        productWeight,
      ]);
      return result.insertId;
    });
  } catch (error) {
    throw new Error(`Failed to add offline customer: ${error.message}`);
  }
};

// Get All Offline Customers
exports.getAllOfflineCustomers = async () => {
  try {
    return await withConnection(async (connection) => {
      const query = "SELECT * FROM organic_farmer_offline_customer_table";
      const [customers] = await connection.execute(query);
      return customers;
    });
  } catch (error) {
    throw new Error(`Failed to fetch offline customers: ${error.message}`);
  }
};

// Get Single Offline Customer by ID
exports.getOfflineCustomerById = async (customerId) => {
  try {
    return await withConnection(async (connection) => {
      const query =
        "SELECT * FROM organic_farmer_offline_customer_table WHERE customer_id = ?";
      const [customers] = await connection.execute(query, [customerId]);
      return customers.length > 0 ? customers[0] : null;
    });
  } catch (error) {
    throw new Error(`Failed to fetch offline customer by ID: ${error.message}`);
  }
};

// Update Offline Customer
exports.updateOfflineCustomer = async (
  customerId,
  customerName,
  customerEmail,
  customerMobile,
  productPrice,
  productQuantity,
  productWeight
) => {
  try {
    return await withConnection(async (connection) => {
      const query = `
        UPDATE organic_farmer_offline_customer_table
        SET
          customer_name = ?,
          customer_email = ?,
          customer_mobile = ?,
          product_price = ?,
          product_quantity = ?,
          product_weight = ?
        WHERE customer_id = ?`;

      const [result] = await connection.execute(query, [
        customerName,
        customerEmail,
        customerMobile,
        productPrice,
        productQuantity,
        productWeight,
        customerId,
      ]);
      return result.affectedRows > 0;
    });
  } catch (error) {
    throw new Error(`Failed to update offline customer: ${error.message}`);
  }
};

// Delete Offline Customer by ID
exports.deleteOfflineCustomerById = async (customerId) => {
  try {
    return await withConnection(async (connection) => {
      const query =
        "DELETE FROM organic_farmer_offline_customer_table WHERE customer_id = ?";
      const [result] = await connection.execute(query, [customerId]);
      return result.affectedRows > 0;
    });
  } catch (error) {
    throw new Error(`Failed to delete offline customer: ${error.message}`);
  }
};
