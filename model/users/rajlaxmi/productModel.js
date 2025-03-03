const { connectToDatabase } = require("../../../config/dbConnection");

// Add Product
exports.addProduct = async (product) => {
  const {
    uid,
    product_name,
    product_description,
    product_price,
    product_quantity,
    product_stock,
    product_category,
    product_image
  } = product;

  try {
    // Convert base64 array to JSON string
    const productImageJSON = JSON.stringify(product_image);

    const connection = await connectToDatabase();
    const query = `
    INSERT INTO rajlaxmi_product (
    uid, 
    product_name, 
    product_description, 
    product_price, 
    product_quantity, 
    product_stock, 
    product_category, 
    product_image) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await connection.execute(query, [
      uid,
      product_name,
      product_description,
      product_price,
      product_quantity,
      product_stock,
      product_category,
      productImageJSON
    ]);
    return result.insertId;

  } catch (error) {
    throw new Error(error.message);
  }
};


// Get All Products
exports.getAllProducts = async () => {
  try {
    const connection = await connectToDatabase();
    const query = `SELECT * FROM rajlaxmi_product`;
    const [products] = await connection.execute(query);
    return products;

  } catch (error) {
    throw new Error(error.message);
  }
};