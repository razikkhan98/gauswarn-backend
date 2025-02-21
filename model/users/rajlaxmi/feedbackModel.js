const { connectToDatabase } = require("../../../config/dbConnection");

exports.feedback = async (feedbackTable) => {
    try {
        const {
            user_name,
            user_email,
            feedback
        } = feedbackTable;

        const connection = await connectToDatabase();
        const query = `INSERT INTO rajlaxmi_feedback (user_name,
                       user_email,feedback)VALUES(?, ?, ?)`

        const [results] = await connection.execute(query,[
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