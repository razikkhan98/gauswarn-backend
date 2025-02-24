const { connectToDatabase } = require("../../../config/dbConnection");

exports.feedback = async (feedbackTable) => {
    try {
        const {
            uid,
            user_name,
            user_email,
            feedback
        } = feedbackTable;

        const connection = await connectToDatabase();
        const query = `INSERT INTO rajlaxmi_feedback (
        uid, user_name, user_email, feedback) VALUES (?, ?, ?, ?)`

        const [results] = await connection.execute(query,[
            uid,
            user_name,
            user_email,
            feedback
        ]);

        return results;
    } catch (error) {
        console.error("Database Error", error);
        throw error;
    }
}

// Get All Feedback
exports.getAllFeedback = async () => {
    try {
        const connection = await connectToDatabase();     
        const query = "SELECT * FROM rajlaxmi_feedback";
        const [feedback] = await connection.execute(query);
        return feedback;
      
    } catch (error) {
      throw new Error(error.message);
    }
  };
  