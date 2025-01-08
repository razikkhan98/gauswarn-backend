const db = require("../config/dbConnection");

// Add Product
exports.addProduct = async (
  product_name,
  product_description,
  product_price,
  product_quantity,
  product_stock,
  product_category,
  product_image
) => {
  try {
    const query = `
      INSERT INTO organic_farmer_table_product (product_name, product_description, product_price, product_quantity, product_stock, product_category,product_image)
      VALUES (?, ?, ?, ?, ?, ?,?)
    `;
    const [result] = await db
      .promise()
      .query(query, [
        product_name,
        product_description,
        product_price,
        product_quantity,
        product_stock,
        product_category,
        product_image,
      ]);
    return result.insertId;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get All Products
exports.getAllProducts = async () => {
  try {
    const query = "SELECT * FROM organic_farmer_table_product";
    const [products] = await db.promise().query(query);
    return products;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get Single Product by ID
exports.getProductById = async (id) => {
  try {
    const query =
      "SELECT * FROM organic_farmer_table_product WHERE product_id = ?";
    const [product] = await db.promise().query(query, [id]);
    return product.length > 0 ? product[0] : null;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Update Product
exports.updateProduct = async (
  id,
  product_name,
  product_description,
  product_price,
  product_quantity,
  product_stock,
  product_category,
  product_image
) => {
  try {
    const query = `
      UPDATE organic_farmer_table_product
      SET product_name = ?, product_description = ?, product_price = ?,product_quantity = ?, product_stock = ?, product_category = ?,product_image = ?
      WHERE product_id = ?
    `;
    const [result] = await db
      .promise()
      .query(query, [
        product_name,
        product_description,
        product_price,
        product_quantity,
        product_stock,
        product_category,
        product_image,
        id,
      ]);
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete Product
exports.deleteProduct = async (id) => {
  try {
    const query =
      "DELETE FROM organic_farmer_table_product WHERE product_id = ?";
    const [result] = await db.promise().query(query, [id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error(error.message);
  }
};
