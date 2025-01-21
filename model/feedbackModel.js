const { withConnection } = require("../utils/helper");

exports.addReview = async (name, email, rating, feedback) => {
  try {
    return await withConnection(async (connection) => {
      console.log("Connecting to database...");
      const query = `
        INSERT INTO organic_farmer_feedback_table (name, email, rating, feedback)
        VALUES (?, ?, ?, ?)
      `;

      const [result] = await connection.execute(query, [
        name,
        email,
        rating,
        feedback,
      ]);
      return result.insertId;
    });
  } catch (error) {
    console.error("Database Error:", error.message);
    throw error;
  }
};

// Fetch all reviews
exports.getAllReviews = async () => {
  try {
    return await withConnection(async (connection) => {
      const query = "SELECT * FROM organic_farmer_feedback_table";
      const [rows] = await connection.execute(query);
      return rows;
    });
  } catch (error) {
    console.log("error: ", error);
  }
};

// new

// Get Single Review by ID
exports.getReviewByIdModal = async (user_id) => {
  try {
    return await withConnection(async (connection) => {
      const query =
        "SELECT * FROM organic_farmer_feedback_table WHERE user_id = ?";
      const [review] = await connection.execute(query, [user_id]);
      return review.length > 0 ? review[0] : null;
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

// Update Review
exports.updateReviewModal = async (user_id, name, email, rating, feedback) => {
  try {
    return await withConnection(async (connection) => {
      const query = `
      UPDATE organic_farmer_feedback_table
      SET name = ?, email = ?, rating = ?, feedback = ?
      WHERE user_id = ?
      `;
      const [result] = await connection.execute(query, [
        name,
        email,
        rating,
        feedback,
        user_id,
      ]);
      return result.affectedRows > 0;
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete Review
exports.deleteReviewModal = async (user_id) => {
  try {
    return await withConnection(async (connection) => {
      const query =
        "DELETE FROM organic_farmer_feedback_table WHERE user_id = ?";
      const [result] = await connection.execute(query, [user_id]);
      return result.affectedRows > 0;
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
