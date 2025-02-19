const { connectToDatabase } = require("../../../config/dbConnection");  // Ensure this imports your DB connection


// Find a user by email
exports.findUserByEmail = async (user_email) => {
  try {
    const connection = await connectToDatabase();
    const query = 'SELECT * FROM rajlaxmi_user_table WHERE user_email = ?'; // Ensure correct table name
    const [rows] = await connection.query(query, [user_email]);
    return rows[0] || null; // Return the first row if found, or null

  } catch (error) {
    console.log("error: ", error);
    return error;
  };
};

// Find a user by phone number
exports.findUserByPhone = async (user_number) => {
  try {
    const connection = await connectToDatabase();
    const query = 'SELECT * FROM rajlaxmi_user_table WHERE user_number = ?'; // Ensure correct table name
    const [rows] = await connection.query(query, [user_number]);
    return rows[0] || null; // Return the first row if found, or null

  } catch (error) {
    console.log("error: ", error);
    return error;
  }
};

// Register a new user
exports.registerUser = async (userData) => {
  const {
    uid,
    user_first_name,
    user_last_name,
    user_email,
    user_password,
    user_number,
    user_country,
    user_state,
    user_city,
    user_address
  } = userData;

  // SQL query to insert all user fields into the 'Rajlaxmi'
  try {
    const connection = await connectToDatabase();
    const query = `
  INSERT INTO rajlaxmi_user_table (
      uid,    
      user_first_name, 
      user_last_name,
      user_email, 
      user_password,
      user_number, 
      user_country, 
      user_state, 
      user_city, 
      user_address 
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // Execute the query with the user data
    const [results] = await connection.execute(query, [
      uid,
      user_first_name,
      user_last_name,
      user_email,
      user_password,
      user_number,
      user_country,
      user_state,
      user_city,
      user_address
    ])
    return results;

  } catch (error) {
    console.log("error: ", error);
    return error;
  }
};
