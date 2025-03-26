const { withConnection } = require("../../../utils/helper");

exports.addWishlist = async (wishlist) => {
    try {
        const {
            uid,
            product_name,
            product_price,
            product_quantity
        } = wishlist;

        return await withConnection(async (connection) => {
            // SQL query
            const query = `INSERT INTO rajlaxmi_wishlist ( uid, product_name, product_price, product_quantity
                   ) VALUES (?, ?, ?, ?)`;

            // Execute the query with the user data
            const [results] = await connection.execute(query, [
                uid,
                product_name,
                product_price,
                product_quantity
            ]);

            return results;
        });
    } catch (error) {
        console.error("Database error:", error);
        throw new Error("Error adding wishlist to the database.");
    }
};

// Get All Wishlist
exports.getAllWishlist = async () => {
    try {
        return await withConnection(async (connection) => {
            const query = `SELECT * FROM rajlaxmi_wishlist`;
            const [products] = await connection.execute(query);
            return products;
        });
    } catch (error) {
        throw new Error(error.message);
    }
};

// Remove wishlist
exports.removeFromWishlist = async (uid) => {
    try {
        return await withConnection(async (connection) => {
            const query = `DELETE FROM rajlaxmi_wishlist WHERE uid = ?`;

            // Executing the delete query
            const [result] = await connection.execute(query, [uid]);

            // Check if any rows were affected (deleted)
            if (result.affectedRows === 0) {
                return null;  // No wishlist item was removed
            }

            return { message: "Wishlist item removed successfully", affectedRows: result.affectedRows };      
        });
    } catch (error) {
        console.error("Error removing wishlist", error);
    }
};
