const db = require("../config/dbConnection");

exports.findAdminUserByEmail = async (email) => {
  try {
    const query = `SELECT * FROM organic_farmer_admin_user WHERE email =?`;
    const [rows] = await db.promise().query(query, [email]);
    return rows[0] || null;
  } catch (error) {
    console.log("error: ", error);
    return error;
  }
};

// Registration new user
exports.adminUserRegister = async (registerTable) => {
  const { full_name, email, mobile_number, password } = registerTable;

  //MySQl query
  try {
    const query = `INSERT INTO organic_farmer_admin_user (full_name, email, mobile_number, password) VALUES (?, ?, ?, ?)`;

    //Execute the query
    const [results] = await db
      .promise()
      .query(query, [full_name, email, mobile_number, password]);
    return results;
  } catch (error) {
    console.log("error: ", error);
    return error;
  }
};
