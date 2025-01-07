const db = require('../config/dbConnection');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const moment = require('moment')

async function exportTableToExcel(tableName) {
    try {

        const todayDate = moment().format("YYYY-MM-DD");

        // const todayDate = "2024-11-01"

        // SQL query with a filter for the date column
        const query = `SELECT * FROM ?? WHERE date = ?`

        const [rows] = await db.promise().query(query, [tableName, todayDate]);

        const worksheet = XLSX.utils.json_to_sheet(rows);


        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, tableName);

        // Specify the output Excel file path        

        const filePath = path.join(__dirname, `${tableName}.csv`);
        // Write the workbook to a file
        XLSX.writeFile(workbook, filePath);

        console.log(`Excel file created successfully: ${filePath}`);
        return filePath; // Return the file path
    } catch (error) {
        console.error('Error exporting table to Excel:', error.message);
        throw error;
    }
}

module.exports = {
    exportTableToExcel
}




