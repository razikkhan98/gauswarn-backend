const asyncHandler = require("express-async-handler");
const wishlistModel = require("../../../model/users/rajlaxmi/wishlistModel");

// Add to Cart Endpoint
exports.addWishlist = asyncHandler(async (req, res) => {
    try {
        const {
            uid,
            product_name,
            product_price,
            product_quantity
        } = req.body;
        console.log(req.body);

        // Validate required fields
        if (
            !uid ||
            !product_name ||
            !product_price ||
            !product_quantity
        ) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        // new user add product
        const newWishlist = {
            uid,
            product_name,
            product_price,
            product_quantity
        };

        await wishlistModel.addWishlist(newWishlist);
        res.status(201).json({ success: true, message: "Add Wishlist successfully!" });
    } catch (error) {
        console.error("Error creating wishlistt:", error);
        res.json({ error: "Failed to create wishlist" });
    }
});


// Get All Wishlist
exports.getAllWishlist = async (req, res) => {
    try {
        const wishlist = await wishlistModel.getAllWishlist();
        res.status(200).json({ wishlist });
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.json({ error: "Failed to fetch wishlist" });
    }
};


// Remove wishlist
exports.removeFromWishlist = asyncHandler(async (req, res) => {
    try {
        const { uid } = req.query;
        
        // Validate required fields
        if (!uid) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        const wishlist = await wishlistModel.removeFromWishlist(uid);
        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist item not found" });
        }
        return res.status(200).json({ message: "Wishlist item removed successfully", data: wishlist });

    } catch (error) {
        console.error("Error remove wishlist", error);
        return res.json({ message: "Server error, failed to add wishlist", error: error.message });
    }
});
