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
      product_image,
      product_tax
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

      // **Calculate Final Price (Including Tax)**
    const taxAmount = (product_price * product_tax) / 100;
    const finalPrice = product_price + taxAmount;

    // **Create Product Object**
    const productData = {
      product_name,
      product_description,
      product_price,
      product_weight: productWeightJSON, // Store as JSON
      product_stock,
      product_category,
      product_image,
      product_tax,
      product_final_price: finalPrice // Store final price including tax
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

exports.getAllProductsWithFeedback = async (req, res) => {
  try {
    const products = await productModel.getAllProductsWithFeedback();
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.json({ error: "Failed to fetch products" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const isUpdated = await productModel.updateProduct(req.body);
    if (!isUpdated) return res.json({ message: "Product not found" });
    res.status(200).json({ message: "Product updated successfully!" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.json({ error: "Failed to update product" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { product_id } = req.body;
    const isDeleted = await productModel.deleteProduct(product_id);
    if (!isDeleted) return res.json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully!" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.json({ error: "Failed to delete product" });
  }
};
