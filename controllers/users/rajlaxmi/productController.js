// rajlaxmi // Controller // Product
const productModel = require("../../../model/users/rajlaxmi/productModel");

// Add Product
exports.addProduct = async (req, res) => {
  try {
    const {
      product_name,
      product_description,
      product_price,
      product_weight, // Array of weights like ["5KG", "10KG"]
      product_stock,
      product_category,
      product_image,
      product_tax,
    } = req.body;

    if (
      !product_name ||
      !product_description ||
      !product_price ||
      !product_weight ||
      !product_stock ||
      !product_category
    ) {
      return res.json({ message: "All fields are required" });
    }

    const productWeightVariants = product_weight.map((weight) => {
      const taxAmount = (Number(product_price) * Number(product_tax)) / 100;
      const finalPrice = product_price + taxAmount;

      return {
        weight,
        base_price: product_price,
        tax: taxAmount,
        final_price: finalPrice,
      };
    });

    const productData = {
      product_name,
      product_description,
      product_price,
      product_weight,
      product_stock,
      product_category,
      product_image,
      product_tax,
      product_final_price: JSON.stringify(productWeightVariants),
    };

    await productModel.addProduct(productData);

    res.json({
      success: true,
      message: "Product created successfully!",
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

exports.getAllProductsWithFeedback = async (req, res) => {
  try {
    const products = await productModel.getAllProductsWithFeedback();
    res.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.json({ error: "Failed to fetch products" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const isUpdated = await productModel.updateProduct(req.body);
    if (!isUpdated) return res.json({ message: "Product not found" });
    res.json({ message: "Product updated successfully!" });
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

    res.json({ message: "Product deleted successfully!" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.json({ error: "Failed to delete product" });
  }
};
