const db = require("../config/dbConnection");

// Add Product
exports.addProduct = async (name, description, price, category) => {
  try {
    const query = `
      INSERT INTO products (name, description, price, category)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db
      .promise()
      .query(query, [name, description, price, category]);
    return result.insertId;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get All Products
exports.getAllProducts = async () => {
  try {
    const query = "SELECT * FROM products";
    const [products] = await db.promise().query(query);
    return products;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get Single Product by ID
exports.getProductById = async (id) => {
  try {
    const query = "SELECT * FROM products WHERE id = ?";
    const [product] = await db.promise().query(query, [id]);
    return product.length > 0 ? product[0] : null;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Update Product
exports.updateProduct = async (id, name, description, price, category) => {
  try {
    const query = `
      UPDATE products
      SET name = ?, description = ?, price = ?, category = ?
      WHERE id = ?
    `;
    const [result] = await db
      .promise()
      .query(query, [name, description, price, category, id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete Product
exports.deleteProduct = async (id) => {
  try {
    const query = "DELETE FROM products WHERE id = ?";
    const [result] = await db.promise().query(query, [id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error(error.message);
  }
};
