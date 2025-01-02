const express = require("express");
const bodyParser = require('body-parser');
const usersRoutes = require("./routes/usersRoutes");
const usersPaymentRoute = require("./routes/paymentRoutes");

const { errorHandler } = require("./middlewares/errorHandler");
const dotenv = require("dotenv")
dotenv.config();
const cors = require("cors");

// Connect to the database
const db = require("./config/dbConnection");
const { exportTableToExcel } = require("./controllers/excelController");
db.connect();
const fs = require('fs');

// Initiate express app

const app = express();

const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Allow specific origins or all origins
app.use(cors({
  origin: "*", // Replace with your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  credentials: true // If you need to allow credentials (e.g., cookies)
}));

// Routes

app.use("/users", usersRoutes, usersPaymentRoute);


// Route to handle the download request
app.get('/download/:tableName', async (req, res) => {
  const { tableName } = req.params;
  // const tableName = `organic_farmer_table_payment`

  try {
    // Export the table to an Excel file
    const filePath = await exportTableToExcel(tableName);

    // Send the file for download
    res.download(filePath, `${tableName}.csv`, (err) => {
      if (err) {
        console.error('Error sending file:', err.message);
        res.status(500).send('Error downloading the file.');
      }

      // Optional: Remove the file after sending it
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err.message);
      });
    });
  } catch (error) {
    res.status(500).send('Error exporting the table to Excel.');
  }
});



// // Path to the uploaded file
// const uploadedFilePath = path.join(__dirname, 'organic_farmer_contact_table.csv');

// // Route to download the uploaded file
// app.get('/download-file', (req, res) => {
//   const fileName = 'organic_farmer_contact_table.csv'; // Name of the file to download
//   res.download(uploadedFilePath, fileName, (err) => {
//     if (err) {
//       console.error('Error downloading file:', err.message);
//       res.status(500).send('Error downloading the file.');
//     }
//   });
// });



// Add other routes

// Error handling middleware
app.use(errorHandler);

// Starting the server

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
