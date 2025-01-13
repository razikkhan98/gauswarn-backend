// const mysql = require("mysql2");
// const dotenv = require("dotenv");
// dotenv.config();
// const moment = require("moment");

// // Create a connection to the database
// const db = mysql.createConnection({
//   host: process.env.DB_HOST, // Your MySQL host (usually 'localhost' for local databases)
//   user: process.env.DB_USER, // Your MySQL username
//   password: process.env.DB_PASSWORD, // Your MySQL password
//   database: process.env.DB_DATABASE, // The name of your MySQL database
//   port: process.env.DB_PORT,
// });

// // Connect to the database
// db.connect((err) => {
//   if (err) {
//     console.log("err:createConnection ", err, moment().format());
//     console.error("Error connecting to MySQL:", err.message);
//     return;
//   }
//   console.log("Connected to MySQL database!");
// });

// module.exports = db;

const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();
const dbConfig = {
  host: process.env.DB_HOST, // Your MySQL host (usually 'localhost' for local databases)
  user: process.env.DB_USER, // Your MySQL username
  password: process.env.DB_PASSWORD, // Your MySQL password
  database: process.env.DB_DATABASE, // The name of your MySQL database
  port: process.env.DB_PORT,
};

console.log("dbConfig:----------- ", dbConfig);
async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("Connected to MySQL--------");
    return connection;
  } catch (err) {
    console.error("Error connecting to MySQL:----------", err);
    process.exit(1);
  }
}

module.exports = { connectToDatabase };
