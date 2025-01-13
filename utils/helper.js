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

const withConnection = async (callback) => {
  const connection = await connectToDatabase();
  try {
    return await callback(connection);
  } catch (err) {
    throw err;
  } finally {
    connection.end();
  }
};
module.exports = { createEmailTransporter, withConnection };
