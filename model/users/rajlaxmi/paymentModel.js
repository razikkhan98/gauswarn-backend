// paymentModel
const { connectToDatabase } = require("../../../config/dbConnection");

exports.userPayment = async (payment) => {
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
    product_quantity
    // cart_items, 
  } = payment;

  try {
    const connection = await connectToDatabase();
    
    // let discountAmount = 0;
    // if(coupon_code){
    //     const couponQuery  = `SELECT * FROM rajlami_coupon WHERE coupon_code = ? AND is_active = 1`;
    //     const[couponResult] = await connection.execute(couponQuery,[coupon_code]);

    //     if (couponResult.length > 0){
    //         const coupon = couponResult[0];
    //         discountAmount = coupon.discount_percentage / 100 * user_total_amount;
    //         console.log(`Coupon :${coupon_code}- Discount: ₹${discountAmount}`);
    //     }else{
    //         console.log("Invalid or expire coupon")
    //     }
    //     }

    //  // Calculate final amount after discount
    //  const finalAmount = user_total_amount - discountAmount;

    // Insert payment details into the payment table
    const insertPaymentQuery = `
      INSERT INTO rajlaxmi_payment (
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
        product_quantity
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // Execute the insert query 
    const [paymentResult] = await connection.execute(insertPaymentQuery, [
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
    //   cart_items
    ]);

    // // Save cart items to the `cart_items` table
    // const insertCartItemsQuery = `
    //   INSERT INTO rajlaxmi_addtocart (payment_id, product_id, product_name, quantity, price) 
    //   VALUES ?`;

    // // Prepare cart items data
    // // const cartItemsData = addtocart.map(cartItem => [
    // //   paymentResult.insertId, 
    // //   cartItem.product_id,
    // //   cartItem.product_name,
    // //   cartItem.quantity,
    // //   cartItem.price
    // // ]);

    // // // Insert all cart items
    // // await connection.query(insertCartItemsQuery, [cartItemsData]);

    // Return a successful response
    return {
      success: true,
      message: "Payment done successfully",
    //   addtocart, 
      billing_details: {
        user_state,
        user_city,
        user_country,
        user_landmark,
        user_house_number,
        total_amount: user_total_amount
      }
    };
  } catch (error) {
    console.error("Error during payment process:", error);
    throw error; 
  }
};
