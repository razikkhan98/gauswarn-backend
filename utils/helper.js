const nodemailer = require("nodemailer");
const { connectToDatabase } = require("../config/dbConnection");

const createEmailTransporter = async () => {
  try {
    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.SMTP_SIW_USER,
        pass: process.env.SMTP_SIW_PASS,
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
    });
  } catch (error) {
    console.log("error:createEmailTransporter ", error);
    throw error;
  }
};

// const withConnection = async (callback) => {
//   const connection = await connectToDatabase();
//   try {
//     return await callback(connection);
//   } catch (err) {
//     throw err;
//   } finally {
//     connection.end();
//   }
// };

const withConnection = async (callback) => {
  const connection = await connectToDatabase(); // Assume this establishes a DB connection
  try {
    return await callback(connection);
  } catch (err) {
    console.error("Error in withConnection:---------------------", err);
    connection.destroy(); // Destroy the connection if an error occurs
    throw err; // Rethrow the error for higher-level handling
  } finally {
    if (connection && connection.state !== "disconnected") {
      connection.end(); // Gracefully end the connection if no errors occurred
    }
  }
};

// Function to calculate profit
const calculateProfit = (sellingPrice, purchase_price, product_quantity) => {
  const purchasingPrice = product_quantity * purchase_price;

  const profitPrice = sellingPrice - purchasingPrice;

  return profitPrice;
};

const shortenUUID = (uuid) => {
  const cleanUuid = uuid.replace(/-/g, "");
  return cleanUuid.substring(0, 5);
};

module.exports = {
  createEmailTransporter,
  withConnection,
  calculateProfit,
  connectToDatabase,
  shortenUUID,
};
