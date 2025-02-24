// rajlaxmi // controller //payment

// const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const paymentModel = require("../../../model/users/rajlaxmi/paymentModel");

exports.userPayment = async (req, res) => {
    const {
        uid,
        user_name,
        user_number,
        user_email,
        user_state,
        user_city,
        user_country,
        user_landmark,
        user_house_number,
        user_total_amount,
        purchase_price,
        product_quantity,
    } = req.body;
    console.log(req.body);

    if (
        !uid ||
        !user_name ||
        !user_number ||
        !user_email ||
        !user_state ||
        !user_city ||
        !user_country ||
        !user_landmark ||
        !user_house_number ||
        !user_total_amount ||
        !purchase_price ||
        !product_quantity
    ) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const amountInPaise = user_total_amount * 100; 

    try {
        // Create a JWT 
        const token = jwt.sign(
            {
                uid,
                user_name,
                user_email,
                amountInPaise,
            },
            process.env.JWT_SECRET, 
            { expiresIn: "1hr" } 
        );

        // Save payment details into the database
        const paymentDetails = {
            uid,
            user_name,
            user_number,
            user_email,
            user_state,
            user_city,
            user_country,
            user_landmark,
            user_house_number,
            user_total_amount,
            purchase_price,
            product_quantity,
            token
        }
          await paymentModel.userPayment(paymentDetails);
           return res.json({
            success: true,
            message: "Payment done successfully",
            token
        });

    } catch (error) {
        
        console.error("Error during payment process:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create payment",
            error: error.message,
        });
    }
};

