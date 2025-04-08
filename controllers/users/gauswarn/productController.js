// controllers/productController.js
const productModel = require("../../../model/users/gauswarn/productModal");

// Add Product
exports.addProduct = async (req, res) => {
  try {
    const {
      product_name,
      product_description,
      product_price,
      product_quantity,
      product_stock,
      product_website_name,
      product_category	,
      product_image

    } = req.body;
    console.log('req.body: ', req.body);
    if (
      !product_name &&
      !product_description &&
      !product_price &&
      !product_quantity &&
      !product_stock &&
      !product_website_name &&
      !product_category&&
      !product_image
    ) {
      return res.json({ message: "All fields are required" });
    }



    const productId = await productModel.addProduct(
      product_name,
      product_description,
      product_price,
      product_quantity,
      product_stock,
      product_website_name,
      product_category,
      product_image
    );
    res.status(201).json({
      success: true,
      message: "Product created successfully!",
      productId,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.json({ error: "Failed to create product" });
  }
};

// Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await productModel.getAllProducts();
    res.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.json({ error: "Failed to fetch products" });
  }
};

// Get Single Product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.getProductById(id);
    if (!product) {
      return res.json({ message: "Product not found" });
    }
    res.json({ product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.json({ error: "Failed to fetch product" });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      product_name,
      product_description,
      product_price,
      product_quantity,
      product_stock,
      product_image,
      product_website_name,
    } = req.body;
    const isUpdated = await productModel.updateProduct(
      id,
      product_name,
      product_description,
      product_price,
      product_quantity,
      product_stock,
      product_image,
      product_website_name
    );
    if (!isUpdated) {
      return res.json({ message: "Product not found" });
    }
    res.json({ message: "Product updated successfully!" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.json({ error: "Failed to update product" });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const isDeleted = await productModel.deleteProduct(id);
    if (!isDeleted) {
      return res.json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully!" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.json({ error: "Failed to delete product" });
  }
};
