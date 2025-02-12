const offlineCustomerModel = require("../model/offlineCustomerModal");

// Add customer
exports.addOfflineCustomer = async (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      product_price,
      customer_mobile,
      product_weight,
      product_quantity,
    } = req.body;


    if (
      !customer_name ||
      !customer_email ||
      !product_price ||
      !customer_mobile ||
      !product_weight ||
      !product_quantity
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const customerId = await offlineCustomerModel.addOfflineCustomer(
      customer_name,
      customer_email,
      product_price,
      customer_mobile,
      product_weight,
      product_quantity
    );

    return res.status(201).json({
      success: true,
      message: "Customer created successfully!",
      customerId,
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    return res.status(500).json({ error: "Failed to create customer" });
  }
};

// Get all customers
exports.getAllOfflineCustomers = async (req, res) => {
  try {
    const customers = await offlineCustomerModel.getAllOfflineCustomers();
    return res.status(200).json({ customers });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return res.status(500).json({ error: "Failed to fetch customers" });
  }
};

// Get single customer by ID
exports.getOfflineCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await offlineCustomerModel.getOfflineCustomerById(id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json({ customer });
  } catch (error) {
    console.error("Error fetching customer:", error);
    return res.status(500).json({ error: "Failed to fetch customer" });
  }
};

// Update customer
exports.updateOfflineCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      customer_name,
      customer_email,
      product_price,
      customer_mobile,
      product_weight,
      product_quantity,
    } = req.body;

    const isUpdated = await offlineCustomerModel.updateOfflineCustomer(
      id,
      customer_name,
      customer_email,
      product_price,
      customer_mobile,
      product_weight,
      product_quantity
    );

    if (!isUpdated) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json({ message: "Customer updated successfully!" });
  } catch (error) {
    console.error("Error updating customer:", error);
    return res.status(500).json({ error: "Failed to update customer" });
  }
};

// Delete customer
exports.deleteOfflineCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const isDeleted = await offlineCustomerModel.deleteOfflineCustomerById(id);

    if (!isDeleted) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json({ message: "Customer deleted successfully!" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return res.status(500).json({ error: "Failed to delete customer" });
  }
};
