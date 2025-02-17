// // /controllers/userController.js
// const bcrypt = require('bcrypt');
// const registerModel = require('../../../model/users/');

// exports.userRegister = async (req, res) => {
//   const { firstName, 
//     lastName, 
//     email, 
//     password, 
//     mobile, 
//     address,
//      city,
//       state,
//        country } = req.body;

//   // Validate required fields
//   if (!firstName || !email || !password || !mobile || !address) {
//     return res.status(400).json({ message: "Please fill in all fields" });
//   }

//   // Validate email format
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(email)) {
//     return res.status(400).json({ message: "Invalid email format" });
//   }

//   // Validate password format
//   const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
//   if (!passwordRegex.test(password)) {
//     return res.status(400).json({
//       message: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number",
//     });
//   }

//   // Validate address format
//   const addressRegex = /^[a-zA-Z0-9\s,'-]*$/;
//   if (!addressRegex.test(address)) {
//     return res.status(400).json({ message: "Invalid address format" });
//   }

// //   // Generate code based on firstName(2) + last 4 digits of mobile number
// //   let mobileString = String(mobile);
// //   const uid = firstName.slice(0, 2) + mobileString.slice(-4);

//   // Hash password
//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(password, salt);

//   // Check if the user already exists
//   registerModel.checkUserExists(email, mobile, (err, results) => {
//     if (err) {
//       return res.status(500).json({ message: "Server error" });
//     }

//     if (results.length > 0) {
//       return res.status(400).json({ message: "User or mobile number already exists" });
//     }

//     // User does not exist, create new user
//     const newUser = {
//       firstName,
//       lastName,
//       email,
//       password: hashedPassword,
//       mobile,
//       address,
//       city,
//       state,
//       country,
//     //   uid
//     };

//     registerModel.createUser(newUser, (err, result) => {
//       if (err) {
//         return res.status(500).json({ message: "Error saving user to database" });
//       }
//       res.status(201).json({ message: "User registered successfully" });
//     });
//   });
// };



// controllers/registerController.js
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const registerModel = require("../../../model/users/rajlaxmi/registerModel");

// register
exports.userRegister = asyncHandler(async (req, res, next) => {


    // Destructure userData to extract required fields
    const {
        user_first_name,
        user_last_name,
        user_email,
        user_password,
        user_number,
        user_country,
        user_state,
        user_city,
        user_address,
    } = req.body;
    try {
        
        // Validate request data
        if (
            !user_first_name ||
            !user_last_name ||
            !user_email ||
            !user_password ||
            !user_number 
        ) {
            return res
            .status(400)
            .json({ message: "Please required all fields" });
        }
        
        // Check if user already exists (by email)
        const userExistsByEmail = await registerModel.findUserByEmail(user_email);
        if (userExistsByEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }
        console.log(userExistsByEmail);

        // // Check if user already exists (by phone number)
        // const userExistsByPhone = await registerModel.findUserByPhone(user_number);
        // if (userExistsByPhone) {
        //     return res.status(400).json({ message: "Phone number already exists" });
        // }

        // Hash the password
        const hashedPassword = await bcrypt.hash(user_password, 10);

        // Create the new user object
        const newUser = {
            user_first_name,
            user_last_name,
            user_email,
            user_password: hashedPassword, 
            user_number,
            user_country,
            user_state,
            user_city,
            user_address,
            
        };

        // Save the new user to the database
        await registerModel.registerUser(newUser);
        res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (error) {
        console.error("Database error:", error); // Log the error for debugging
        res.status(500).json({ message: "Database error", error: error.message });
    }
});