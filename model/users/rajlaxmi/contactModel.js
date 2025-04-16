const { connectToDatabase } = require("../../../config/dbConnection");
const { withConnection } = require("../../../utils/helper");

exports.userContact = async (contactTable) => {
  try {
    const {
      uid,
      user_name,
      user_email,
      user_number,

      message,
    } = contactTable;

    const connection = await connectToDatabase();
    const query = `INSERT INTO rajlaxmi_contact (
    uid, user_name, user_email, user_number,  message) 
    VALUES(?, ?, ?, ?, ?)`;

    const [results] = await connection.execute(query, [
      uid,
      user_name,
      user_email,
      user_number,

      message,
    ]);

    return results;
  } catch (error) {
    console.error(" Database Error", error);
    throw error;
  }
};

// admin
exports.getAllContactRajlaxmi = async () => {
  try {
    return await withConnection(async (connection) => {
      const query = `
        SELECT *
        FROM rajlaxmi_contact;
      `;
      const [rows] = await connection.execute(query, []);
      return rows;
    });
  } catch (error) {
    console.error("Error in getAllContactRajlaxmi:", error);
    throw error;
  }
};
