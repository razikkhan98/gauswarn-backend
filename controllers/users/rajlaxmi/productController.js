// rajlaxmi // Controller // Product
const productModel = require("../../../model/users/rajlaxmi/productModel");

// Add Product
exports.addProduct = async (req, res) => {
  try {
    const {
      uid,
      product_name,
      product_description,
      product_price,
      product_quantity,
      product_stock,
      product_category,
      product_image

    } = req.body;
    
    // Validation
    if (
      !uid &&
      !product_name &&
      !product_description &&
      !product_price &&
      !product_quantity &&
      !product_stock &&
      !product_category&&
      !product_image
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // new user add product
    const productUser = {
      uid,
      product_name,
      product_description,
      product_price,
      product_quantity,
      product_stock,
      product_category,
      product_image
    };
    console.log(productUser);
    
    await productModel.addProduct(productUser);
    res.status(201).json({
      success: true,
      message: "Product created successfully!",
    //   productId,
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
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.json({ error: "Failed to fetch products" });
  }
};
