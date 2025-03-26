const { withConnection } = require("../../../utils/helper");

exports.findUserByEmail = async (email) => {
  try {
    return await withConnection(async (connection) => {
      const query = `SELECT * FROM rajlaxmi_user WHERE email = ?`;
      const [rows] = await connection.execute(query, [email]);
      return rows[0] || null;
    });
  } catch (error) {
    console.log("error: ", error);
    return error;
  }
};

// Find a user by phone number
exports.findUserByPhone = async (mobileNumber) => {
  try {
    // const connection = await connectToDatabase();
    return await withConnection(async (connection) => {
      const query = `SELECT * FROM rajlaxmi_user WHERE mobileNumber = ?`;
      console.log("Executing query:", query, "with value:", mobileNumber);
      const [rows] = await connection.execute(query, [mobileNumber]);

      if (!rows.length) {
        console.log("No user found with this mobile number.");
        return null;
      }
      console.log("User found:", rows[0]); // Debugging output
      return rows[0];
    });
  } catch (error) {
    console.error("Database error in findUserByPhone:", error);
    throw new Error("Database query failed");
  }
};

// Register a new user
exports.registerUser = async (userData) => {
  const { uid, firstName, lastName, email, password, mobileNumber } = userData;

  try {
    return await withConnection(async (connection) => {
      const query = `
        INSERT INTO rajlaxmi_user (
          uid,    
          firstName, 
          lastName,
          email, 
          password,
          mobileNumber  
        ) VALUES (?, ?, ?, ?, ?, ?)`;

      // Execute the query with the user data
      const [results] = await connection.execute(query, [
        uid,
        firstName,
        lastName,
        email,
        password,
        mobileNumber,
      ]);

      return results;
    });
  } catch (error) {
    console.error("Database error in registerUser:", error);
    throw new Error("Database query failed");
  }
};
