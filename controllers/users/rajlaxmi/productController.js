// rajlaxmi // Controller // Product
const productModel = require("../../../model/users/rajlaxmi/productModel");

// Add Product
exports.addProduct = async (req, res) => {
  try {
    const {
      product_name,
      product_description,
      product_price,
      product_weight, // Array: [ 5KG, 10KG, 15KG, 20KG ]
      product_stock,
      product_category,
      product_image
    } = req.body;

    // **Validation Check**
    if (
      !product_name || 
      !product_description || 
      !product_price || 
      !product_weight || 
      !product_stock || 
      !product_category
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // **Convert product_weight array to JSON**
    const productWeightJSON = JSON.stringify(product_weight);

    // **Create Product Object**
    const productData = {
      product_name,
      product_description,
      product_price,
      product_weight: productWeightJSON, // Store as JSON
      product_stock,
      product_category,
      product_image
    };

    // **Insert Product into Database**
    await productModel.addProduct(productData);

    res.status(201).json({
      success: true,
      message: "Product created successfully!",
    });

  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" }); // Set correct status code
  }
};


// Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await productModel.getAllProducts();
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.json({ error: "Failed to fetch products" });
  }
};
