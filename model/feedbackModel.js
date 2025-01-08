const db = require("../config/dbConnection");

exports.addReview = async (name, email, rating, feedback) => {
  try {
    console.log("Connecting to database...");
    const query = `
      INSERT INTO organic_farmer_feedback_table (name, email, rating, feedback)
      VALUES (?, ?, ?, ?)
    `;
    // console.log("Executing query:", query);
    const [result] = await db
      .promise()
      .query(query, [name, email, rating, feedback]);
    // console.log("Query result:", result);
    return result.insertId;
  } catch (error) {
    console.error("Database Error:", error.message);
    throw error;
  }
};

// Fetch all reviews
exports.getAllReviews = async () => {
  try {
    const query = "SELECT * FROM organic_farmer_feedback_table";
    const [rows] = await db.promise().query(query);
    return rows;
  } catch (error) {
    console.log("error: ", error);
  }
};

// new

// Get Single Review by ID
exports.getReviewByIdModal = async (id) => {
  try {
    const query = "SELECT * FROM organic_farmer_feedback_table WHERE id = ?";
    const [review] = await db.promise().query(query, [id]);
    return review.length > 0 ? review[0] : null;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Update Review
exports.updateReviewModal = async (id, name, email, rating, feedback) => {
  try {
    const query = `
      UPDATE organic_farmer_feedback_table
      SET name = ?, email = ?, rating = ?, feedback = ?
      WHERE id = ?
    `;
    const [result] = await db
      .promise()
      .query(query, [name, email, rating, feedback, id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete Review
exports.deleteReviewModal = async (id) => {
  try {
    const query = "DELETE FROM organic_farmer_feedback_table WHERE id = ?";
    const [result] = await db.promise().query(query, [id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error(error.message);
  }
};
