const { connectToDatabase } = require("../../../config/dbConnection");

// Add Product
const { v4: uuidv4 } = require("uuid"); // Import UUID package
const { withConnection, shortenUUID } = require("../../../utils/helper");

exports.addProduct = async (productData) => {
  try {
    let {
      product_name,
      product_description,
      product_price,
      product_weight, // Array: [ 5KG, 10KG, 15KG, 20KG ]
      product_stock,
      product_category,
      product_image,
    } = productData;

    // Generate a unique product_id
    const product_id_long = uuidv4();
    const product_id = shortenUUID(product_id_long);
    // Convert product_weight array to JSON string
    // const productWeightJSON = JSON.stringify(product_weight);
    // console.log('productWeightJSON: ', productWeightJSON);

    return await withConnection(async (connection) => {
      const query = `
      INSERT INTO rajlaxmi_product 
      (product_id, product_name, product_description, product_price, product_weight, product_stock, product_category, product_image) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

      const [result] = await connection.execute(query, [
        product_id,
        product_name,
        product_description,
        product_price,
        product_weight,
        product_stock,
        product_category,
        product_image,
      ]);

      return product_id; // Return the unique product_id
    });
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
