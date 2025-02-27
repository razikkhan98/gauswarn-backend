// rajlaxmi // controller //payment

const jwt = require("jsonwebtoken");
const paymentModel = require("../../../model/users/rajlaxmi/paymentModel");
// const addtocartModel = require("../../../model/users/rajlaxmi/addtocartModel");


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
        // addtocart
    } = req.body;

    console.log(req.body);

    // Validation
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
        // !addtocart  
    ){
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

     const amountInPaise = user_total_amount * 100; 

    try {
        //   const cartItems = await addtocartModel.findCartItem(uid);
        // if (!cartItems || cartItems.length === 0) {
        //     return res.status(400).json({ success: false, message: "No items in cart" });
        // }

        // Create JWT token for the payment 
        const token = jwt.sign(
            {
                uid,
                user_name,
                user_email,
                amountInPaise,
            },
            process.env.JWT_SECRET, { expiresIn: "1hr" } 
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
            // addtocart
        };

        // Save payment 
        await paymentModel.userPayment(paymentDetails);

        return res.json({
            success: true,
            message: "Payment done successfully",
            token,
            billing_details: {  
                user_state,
                user_city,
                user_country,
                user_landmark,
                user_house_number,
                total_amount: user_total_amount
            },
            // cart_items:cartItems
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