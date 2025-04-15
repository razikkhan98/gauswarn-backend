const { connectToDatabase } = require("../../../config/dbConnection");
const { withConnection } = require("../../../utils/helper");

exports.addReview = async (
  uid,
  product_id,
  user_name,
  user_email,
  rating,
  feedback
) => {
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

exports.getAllReviewsRajlaxmi = async () => {
  try {
    return await withConnection(async (connection) => {
      const query = "SELECT * FROM rajlaxmi_feedback";
      const [rows] = await connection.execute(query);
      return rows;
    });
  } catch (error) {
    console.log("error: ", error);
    throw error;
  }
};

exports.getReviewsByProduct = async (product_id) => {
  let connection;
  try {
    connection = await connectToDatabase();
    const query = "SELECT * FROM rajlaxmi_feedback WHERE product_id = ?";
    const [rows] = await connection.execute(query, [product_id]);
    return rows;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  } finally {
    if (connection) await connection.end(); // Close connection to prevent leaks
  }
};
