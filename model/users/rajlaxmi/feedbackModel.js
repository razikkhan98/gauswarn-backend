const { connectToDatabase } = require("../../../config/dbConnection");

// exports.feedback = async (feedbackTable) => {
//     try {
//         const {
//             uid,
//             user_name,
//             user_email,
//             feedback
//         } = feedbackTable;

//         const connection = await connectToDatabase();
//         const query = `INSERT INTO rajlaxmi_feedback (
//         uid, user_name, user_email, feedback) VALUES (?, ?, ?, ?)`

//         const [results] = await connection.execute(query,[
//             uid,
//             user_name,
//             user_email,
//             feedback
//         ]);

//         return results;
//     } catch (error) {
//         console.error("Database Error", error);
//         throw error;
//     }
// }

// // Get All Feedback
// exports.getAllFeedback = async () => {
//     try {
//         const connection = await connectToDatabase();     
//         const query = "SELECT * FROM rajlaxmi_feedback";
//         const [feedback] = await connection.execute(query);
//         return feedback;
      
//     } catch (error) {
//       throw new Error(error.message);
//     }
//   };
  








// const { withConnection } = require("../../../utils/helper");

exports.addReview = async (uid, user_name, user_email, rating, feedback) => {
  try {
    const connection = await connectToDatabase();
      const query = `INSERT INTO rajlaxmi_feedback (uid, user_name, user_email, rating, feedback)
        VALUES (?, ?, ?, ?, ?)`;

      const [result] = await connection.execute(query, [
        uid,
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
exports.getAllReviews = async () => {
  try {
    const connection = await connectToDatabase();
    const query = "SELECT * FROM rajlaxmi_feedback";
      const [rows] = await connection.execute(query);
      return rows;
    
  } catch (error) {
    console.log("error: ", error);
  }
};

// Get By Id
exports.getReviewByIdModal = async (uid) => {
    try {
      const connection = await connectToDatabase();
        const query = `SELECT * FROM rajlaxmi_feedback WHERE uid = ?`;
        console.log(query);
        const [review] = await connection.execute(query, [uid]);
        return review.length > 0 ? review[0] : null;
      
    } catch (error) {
      throw new Error(error.message);
    }
  };