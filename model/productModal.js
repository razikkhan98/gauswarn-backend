const { withConnection } = require("../utils/helper");

// Add Product
exports.addProduct = async (
  product_name,
  product_description,
  product_price,
  product_quantity,
  product_stock,
  product_category,
  product_image,
  product_website_name
) => {
  try {
    // Convert base64 array to JSON string
    const productImageJSON = JSON.stringify(product_image || []);
    

    return await withConnection(async (connection) => {
      const query = `
      INSERT INTO organic_farmer_table_product (product_name, product_description, product_price, product_quantity, product_stock, product_category,product_image,product_website_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
      const [result] = await connection.execute(query, [
        product_name,
        product_description,
        product_price,
        product_quantity,
        product_stock,
        product_category,
        productImageJSON,
        product_website_name,
      ]);
      return result.insertId;
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get All Products
exports.getAllProducts = async () => {
  try {
    return await withConnection(async (connection) => {
      const query = "SELECT * FROM organic_farmer_table_product";
      const [products] = await connection.execute(query);
      return products;
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get Single Product by ID
exports.getProductById = async (id) => {
  try {
    return await withConnection(async (connection) => {
      const query =
        "SELECT * FROM organic_farmer_table_product WHERE product_id = ?";
      const [product] = await connection.execute(query, [id]);
      return product.length > 0 ? product[0] : null;
    });
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
  product_image,
  product_website_name
) => {
  try {
    // Convert base64 array to JSON string
    const productImageJSON = JSON.stringify(product_image);

    return await withConnection(async (connection) => {
      const query = `
      UPDATE organic_farmer_table_product
      SET product_name = ?, product_description = ?, product_price = ?,product_quantity = ?, product_stock = ?, product_category = ?, product_image = ?, product_website_name = ?
      WHERE product_id = ?
    `;
      const [result] = await connection.execute(query, [
        product_name,
        product_description,
        product_price,
        product_quantity,
        product_stock,
        product_category,
        productImageJSON,
        product_website_name,
        id,
      ]);
      return result.affectedRows > 0;
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete Product
exports.deleteProduct = async (id) => {
  try {
    return await withConnection(async (connection) => {
      const query =
        "DELETE FROM organic_farmer_table_product WHERE product_id = ?";
      const [result] = await connection.execute(query, [id]);
      return result.affectedRows > 0;
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
