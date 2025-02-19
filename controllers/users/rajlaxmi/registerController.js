// controllers/registerController.js
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const registerModel = require("../../../model/users/rajlaxmi/registerModel");

// register
exports.userRegister = asyncHandler(async (req, res, next) => {
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

        // Check if user already exists (by phone number)
        const userExistsByPhone = await registerModel.findUserByPhone(user_number);
        if (userExistsByPhone) {
            return res.status(400).json({ message: "Phone number already exists" });
        }

        // Generate code based on , firstName(2) , mobile last 4 digit of mobile number
        let numberString = String(user_number);
        const code = user_first_name.slice(0, 2) + numberString.slice(-4);
        
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
            uid: code,
        };
        console.log(newUser);

        // Save the new user to the database
        await registerModel.registerUser(newUser);
        res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (error) {
        console.error("Database error:", error); 
        res.status(500).json({ message: "Database error", error: error.message });
    }
});