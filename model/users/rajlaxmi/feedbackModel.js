const { connectToDatabase } = require("../../../config/dbConnection");

exports.addReview = async (uid, product_id, user_name, user_email, rating, feedback) => {
  try {
    const connection = await connectToDatabase();
      const query = `INSERT INTO rajlaxmi_feedback (uid,product_id, user_name , user_email, rating, feedback)
        VALUES (?, ?, ?, ?, ?,?)`;

      const [result] = await connection.execute(query, [
        uid,
        product_id,
        user_name,
        user_email,
        rating,
        feedback,
        
      ]);
      return result.insertId;
    
  } catch (error) {
    console.error("Database Error:", error.message);
    throw error;
  }
};

// Fetch all reviews
// exports.getAllReviews = async () => {
//   try {
//     const connection = await connectToDatabase();
//     const query = "SELECT * FROM rajlaxmi_feedback";
//       const [rows] = await connection.execute(query);
//       return rows;
    
//   } catch (error) {
//     console.log("error: ", error);
//   }
// };

exports.getReviewsByProduct = async (uid, product_id) => {
  try {
    const connection = await connectToDatabase();
    const query = "SELECT * FROM rajlaxmi_feedback WHERE uid = ? AND product_id = ?";
    const [rows] = await connection.execute(query, [uid, product_id]);
    return rows;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

// Get By Id
exports.getReviewByIdModal = async (uid, product_id) => {
  try {
    const connection = await connectToDatabase();
    const query = "SELECT * FROM rajlaxmi_feedback WHERE uid = ? AND product_id = ?";
    const [rows] = await connection.execute(query, [uid, product_id]);

    return rows.length ? rows[0] : null; // Return first review or null if not found
  } catch (error) {
    console.error("Error fetching review by ID:", error);
    throw error;
  }
};
