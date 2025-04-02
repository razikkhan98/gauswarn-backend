// rajlaxmi // controller //payment

// const jwt = require("jsonwebtoken");
// const paymentModel = require("../../../model/users/rajlaxmi/paymentModel");

// exports.userPayment = async (req, res) => {
//     const {
//         uid,
//         user_name,
//         user_number,
//         user_email,
//         user_state,
//         user_city,
//         user_country,
//         user_landmark,
//         user_house_number,
//         user_total_amount,
//         purchase_price,
//         product_quantity
//     } = req.body;

//     try {
//     // Validation
//     if (
//         !uid ||
//         !user_name ||
//         !user_number ||
//         !user_email ||
//         !user_state ||
//         !user_city ||
//         !user_country ||
//         !user_landmark ||
//         !user_house_number ||
//         !user_total_amount ||
//         !purchase_price ||
//         !product_quantity
//     ){
//         return res.status(400).json({ success: false, message: "All fields are required." });
//     }

//     const date = moment().format("YYYY-MM-DD");
//       const time = getCurrentTime();

// // Convert user_total_amount to paise for PhonePe
//      const amountInPaise = user_total_amount * 100;

//         // Create JWT token for the payment
//         const token = jwt.sign(
//             {
//                 uid,
//                 user_name,
//                 user_email,
//                 amountInPaise,
//             },
//             process.env.JWT_SECRET, { expiresIn: "1hr" }
//         );

//         // Save payment details into the database
//         const paymentDetails = {
//             uid,
//             user_name,
//             user_number,
//             user_email,
//             user_state,
//             user_city,
//             user_country,
//             user_landmark,
//             user_house_number,
//             user_total_amount,
//             purchase_price,
//             product_quantity
//         };

//         // Save payment
//         await paymentModel.userPayment(paymentDetails);
//         return res.json({
//             success: true,
//             message: "Payment done successfully",
//             token,
//             billing_details: {
//                 user_state,
//                 user_city,
//                 user_country,
//                 user_landmark,
//                 user_house_number,
//                 total_amount: user_total_amount
//             }
//         });
//     } catch (error) {
//         console.error("Error during payment process:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to create payment",
//             error: error.message,
//         });
//     }
// };

// const moment = require("moment");
// const { v4: uuidv4 } = require("uuid");
// const jwt = require("jsonwebtoken");
// const axios = require("axios");
// // const withConnection = require("../config/db");
// // const { generateChecksumForPhonePe, generateMergedKey } = require("../utils/helpers");
// const {
//     generateChecksumForPhonePe,
//     generateMergedKey,
//   } = require("../../../utils/payment.service");
//   const { withConnection } = require("../../../utils/helper");

// const createPaymentAndGenerateUrl = async (req, res) => {
//   try {
//     const {
//       uid, // Added UID
//       user_name,
//       user_mobile_num,
//       user_email,
//       user_state,
//       user_city,
//       user_country,
//       user_house_number,
//       user_landmark,
//       user_pincode,
//       user_total_amount,
//       purchase_price,
//       product_quantity,
//     } = req.body;

//     // ✅ Validate the required fields
//     if (
//       !uid || !user_name || !user_mobile_num || !user_email ||
//       !user_state || !user_city || !user_country || !user_house_number ||
//       !user_landmark || !user_pincode || !user_total_amount ||
//       !purchase_price || !product_quantity
//     ) {
//       return res.status(400).json({ success: false, message: "All fields are required." });
//     }

//     const date = moment().format("YYYY-MM-DD");
//     const time = moment().format("HH:mm:ss");

//     // ✅ Convert amount to paise for PhonePe
//     const amountInPaise = user_total_amount * 100;

//     // ✅ Insert user details into the database
//     const userQuery = `
//       INSERT INTO rajlaxmi_payment
//       (uid, user_name, user_mobile_num, user_email, user_state, user_city, user_country,
//        user_house_number, user_landmark, user_pincode, user_total_amount, purchase_price,
//        product_quantity, date, time)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     const [result] = await withConnection(async (connection) => {
//       return connection.execute(userQuery, [
//         uid,
//         user_name,
//         user_mobile_num,
//         user_email,
//         user_state,
//         user_city,
//         user_country,
//         user_house_number,
//         user_landmark,
//         user_pincode,
//         user_total_amount,
//         purchase_price,
//         product_quantity,
//         date,
//         time,
//       ]);
//     });

//     // ✅ Get inserted user ID
//     const userId = result.insertId;

//     // ✅ Create unique order ID
//     const orderId = uuidv4();

//     // ✅ Generate a merged key for security
//     const mergedKey = await generateMergedKey(user_name, user_mobile_num, orderId);

//     // ✅ Create JWT token for secure data exchange
//     const token = jwt.sign(
//       { userId, uid, user_name, user_email, orderId, amountInPaise },
//       process.env.JWT_SECRET,
//       { expiresIn: "6m" }
//     );

//     // ✅ Define the payment payload for PhonePe
//     const paymentPayload = {
//       merchantId: process.env.PHONEPE_MERCHANT_ID,
//       merchantUserId: uid, // Using uid
//       mobileNumber: user_mobile_num,
//       amount: amountInPaise,
//       merchantTransactionId: orderId,
//       redirectUrl: `${process.env.REDIRECT_URL_TO_BACKEND_API}/?id=${orderId}&tarnId=${userId}`,
//       redirectMode: "POST",
//       paymentInstrument: {
//         type: "PAY_PAGE",
//       },
//     };

//     // ✅ Encode payload to Base64
//     const payload = Buffer.from(JSON.stringify(paymentPayload)).toString("base64");

//     // ✅ Generate checksum for PhonePe request
//     const checksum = await generateChecksumForPhonePe(payload);

//     // ✅ Configure the PhonePe API request
//     const options = {
//       method: "POST",
//       url: process.env.PHONEPE_MERCHANT_BASE_URL,
//       headers: {
//         accept: "application/json",
//         "Content-Type": "application/json",
//         "X-VERIFY": checksum,
//       },
//       data: {
//         request: payload,
//       },
//     };

//     // ✅ Send the request to PhonePe
//     const response = await axios.request(options);
//     console.log("PhonePe Response: ", response.data);

//     if (!response.data || !response.data.data || !response.data.data.instrumentResponse) {
//       throw new Error("Invalid response from PhonePe");
//     }

//     // ✅ Extract redirect URL
//     const redirectUrl = response.data.data.instrumentResponse.redirectInfo.url;

//     if (!redirectUrl) {
//       throw new Error("Redirect URL not found in PhonePe response");
//     }

//     // ✅ Send response to frontend
//     res.json({
//       success: true,
//       message: "Payment URL generated successfully",
//       url: redirectUrl,
//       token,
//       mergedKey,
//       date: moment().format("MMMM Do YYYY, h:mm:ss a"),
//     });

//   } catch (error) {
//     console.error("Error in createPaymentAndGenerateUrl:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to create payment or generate URL",
//       error: error.message,
//     });
//   }
// };

// const getPhonePeUrlStatusAndUpdatePayment = async (req, res) => {
//   const merchantTransactionId = req?.query?.id;
//   const tarnId = req?.query?.tarnId;

//   const keyIndex = process.env.SALT_INDEX;
//   const string =
//     `/pg/v1/status/${process.env.PHONEPE_MERCHANT_ID}/${merchantTransactionId}` +
//     process.env.PHONEPE_MERCHANT_KEY;
//   const sha256 = crypto.createHash("sha256").update(string).digest("hex");
//   const checksum = sha256 + "###" + keyIndex;

//   const option = {
//     method: "GET",
//     url: `${process.env.PHONEPE_MERCHANT_STATUS_URL}/${process.env.PHONEPE_MERCHANT_ID}/${merchantTransactionId}`,
//     headers: {
//       accept: "application/json",
//       "Content-Type": "application/json",
//       "X-VERIFY": checksum,
//       "X-MERCHANT-ID": process.env.PHONEPE_MERCHANT_ID,
//     },
//   };

//   try {
//     const response = await axios.request(option);
//     const paymentStatus = response.data.code;
//     const paymentDetails = response.data;

//     // Update payment status in the database
//     const query = `UPDATE gauswarn_payment SET status = ?, paymentDetails = ?, isPaymentPaid = ? WHERE user_id = ?`;
//     const isPaymentPaid = paymentStatus === "true";

//     const [result] = await withConnection(async (connection) => {
//       return connection.execute(query, [
//         paymentStatus,
//         JSON.stringify(paymentDetails),
//         isPaymentPaid,
//         tarnId,
//       ]);
//     });

//     if (result === 0) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Payment record not found." });
//     }

//     if (response?.data?.code === "PAYMENT_SUCCESS") {

//       return res.redirect(process.env.REDIRECT_URL_TO_SUCCESS_PAGE);
//     }

//     if (response?.data?.code === "PAYMENT_ERROR") {
//       return res.redirect(process.env.REDIRECT_URL_TO_FAILURE_PAGE);
//     }
//   } catch (err) {
//     console.error(
//       "Error fetching PhonePe status or updating database:",
//       err.message
//     );
//     return res.status(500).json({ success: false, error: err.message });
//   }
// };

// module.exports = {
//   createPaymentAndGenerateUrl,
//   getPhonePeUrlStatusAndUpdatePayment
// };

const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const crypto = require("crypto");
const {
  generateChecksumForPhonePe,
  generateMergedKey,
} = require("../../../utils/payment.service");
const { withConnection } = require("../../../utils/helper");

// const createPaymentAndGenerateUrl = async (req, res) => {
//   try {
//     const {
//       uid,
//       user_name,
//       user_mobile_num,
//       user_email,
//       user_state,
//       user_city,
//       user_country,
//       user_house_number,
//       user_landmark,
//       user_pincode,
//       user_total_amount,
//       purchase_price,
//       product_quantity,

//     } = req.body;

//     if (
//       !uid ||
//       !user_name ||
//       !user_mobile_num ||
//       !user_email ||
//       !user_state ||
//       !user_city ||
//       !user_country ||
//       !user_house_number ||
//       !user_landmark ||
//       !user_pincode ||
//       !user_total_amount ||
//       !purchase_price ||
//       !product_quantity
//     ) {
//       return res.status(400).json({ success: false, message: "All fields are required." });
//     }

//     const date = moment().format("YYYY-MM-DD");
//     const time = moment().format("HH:mm:ss");
//     const amountInPaise = user_total_amount * 100;
//     const orderId = uuidv4();

//     const userQuery = `
//       INSERT INTO rajlaxmi_payment
//       (uid, user_name, user_mobile_num, user_email, user_state, user_city, user_country,
//        user_house_number, user_landmark, user_pincode, user_total_amount, purchase_price,
//        product_quantity, date, time)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     const [result] = await withConnection(async (connection) => {
//       return connection.execute(userQuery, [
//         uid,
//         user_name,
//         user_mobile_num,
//         user_email,
//         user_state,
//         user_city,
//         user_country,
//         user_house_number,
//         user_landmark,
//         user_pincode,
//         user_total_amount,
//         purchase_price,
//         product_quantity,
//         date,
//         time,
//       ]);
//     });

//     const userId = result.insertId;
//     const mergedKey = await generateMergedKey(user_name, user_mobile_num, orderId);
//     const token = jwt.sign(
//       { userId, uid, user_name, user_email, orderId, amountInPaise },
//       process.env.JWT_SECRET,
//       { expiresIn: "6m" }
//     );

//     const paymentPayload = {
//       merchantId: process.env.PHONEPE_MERCHANT_ID,
//       merchantUserId: uid,
//       mobileNumber: user_mobile_num,
//       amount: amountInPaise,
//       merchantTransactionId: orderId,
//       redirectUrl: `${process.env.REDIRECT_URL_TO_BACKEND_API}/?id=${orderId}&tarnId=${userId}`,
//       redirectMode: "POST",
//       paymentInstrument: { type: "PAY_PAGE" },
//     };

//     const payload = Buffer.from(JSON.stringify(paymentPayload)).toString("base64");
//     const checksum = await generateChecksumForPhonePe(payload);

//     const options = {
//       method: "POST",
//       url: process.env.PHONEPE_MERCHANT_BASE_URL,
//       headers: {
//         accept: "application/json",
//         "Content-Type": "application/json",
//         "X-VERIFY": checksum,
//       },
//       data: { request: payload },
//     };

//     const response = await axios.request(options);

//     if (!response.data?.data?.instrumentResponse?.redirectInfo?.url) {
//       throw new Error("Redirect URL not found in PhonePe response");
//     }

//     res.json({
//       success: true,
//       message: "Payment URL generated successfully",
//       url: response.data.data.instrumentResponse.redirectInfo.url,
//       token,
//       mergedKey,
//       date: moment().format("MMMM Do YYYY, h:mm:ss a"),
//     });
//   } catch (error) {
//     console.error("Error in createPaymentAndGenerateUrl:", error);
//     res.status(500).json({ success: false, message: "Payment generation failed", error: error.message });
//   }
// };

// const getPhonePeUrlStatusAndUpdatePayment = async (req, res) => {
//   try {
//     const merchantTransactionId = req.query.id;
//     const tarnId = req.query.tarnId;
//     const keyIndex = process.env.SALT_INDEX;

//     const string = `/pg/v1/status/${process.env.PHONEPE_MERCHANT_ID}/${merchantTransactionId}` +
//       process.env.PHONEPE_MERCHANT_KEY;
//     const sha256 = crypto.createHash("sha256").update(string).digest("hex");
//     const checksum = sha256 + "###" + keyIndex;

//     const option = {
//       method: "GET",
//       url: `${process.env.PHONEPE_MERCHANT_STATUS_URL}/${process.env.PHONEPE_MERCHANT_ID}/${merchantTransactionId}`,
//       headers: {
//         accept: "application/json",
//         "Content-Type": "application/json",
//         "X-VERIFY": checksum,
//         "X-MERCHANT-ID": process.env.PHONEPE_MERCHANT_ID,
//       },
//     };

//     const response = await axios.request(option);
//     const paymentStatus = response.data.code;
//     const paymentDetails = JSON.stringify(response.data);
//     const isPaymentPaid = paymentStatus === "PAYMENT_SUCCESS";

//     const query = `UPDATE rajlaxmi_payment SET status = ?, paymentDetails = ?, isPaymentPaid = ? WHERE id = ?`;
//     await withConnection(async (connection) => connection.execute(query, [paymentStatus, paymentDetails, isPaymentPaid, tarnId]));

//     const redirectUrl = isPaymentPaid ? process.env.REDIRECT_URL_TO_SUCCESS_PAGE : process.env.REDIRECT_URL_TO_FAILURE_PAGE;
//     res.redirect(redirectUrl);
//   } catch (err) {
//     console.error("Error fetching PhonePe status or updating database:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// module.exports = { createPaymentAndGenerateUrl, getPhonePeUrlStatusAndUpdatePayment };

const createPaymentAndGenerateUrl = async (req, res) => {
  try {
    const {
      uid,
      user_name,
      user_mobile_num,
      user_email,
      user_state,
      user_city,
      user_country,
      user_house_number,
      user_landmark,
      user_pincode,
      user_total_amount,
      purchase_price,
      product_quantity,
      user_coupon,
    } = req.body;


    if (
      !uid ||
      !user_name ||
      !user_mobile_num ||
      !user_email ||
      !user_state ||
      !user_city ||
      !user_country ||
      !user_house_number ||
      !user_landmark ||
      !user_pincode ||
      !user_total_amount ||
      !purchase_price
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const date = moment().format("YYYY-MM-DD");
    const time = moment().format("HH:mm:ss");
    const amountInPaise = user_total_amount * 100;
    const orderId = uuidv4();

    const userQuery = `
      INSERT INTO rajlaxmi_payment 
      (uid, user_name, user_mobile_num, user_email, user_state, user_city, user_country, 
       user_house_number, user_landmark, user_pincode, user_total_amount, purchase_price, 
        user_coupon, date, time) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await withConnection(async (connection) => {
      return connection.execute(userQuery, [
        uid,
        user_name,
        user_mobile_num,
        user_email,
        user_state,
        user_city,
        user_country,
        user_house_number,
        user_landmark,
        user_pincode,
        user_total_amount,
        purchase_price,

        user_coupon,
        date,
        time,
      ]);
    });

    const userId = result.insertId;
    const mergedKey = await generateMergedKey(
      user_name,
      user_mobile_num,
      orderId
    );
    const token = jwt.sign(
      {
        userId,
        uid,
        user_name,
        user_email,
        orderId,
        amountInPaise,
        user_coupon,
      }, // Include user_coupon in token
      process.env.JWT_SECRET,
      { expiresIn: "6m" }
    );

    const paymentPayload = {
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      merchantUserId: uid,
      mobileNumber: user_mobile_num,
      amount: amountInPaise,
      merchantTransactionId: orderId,
      redirectUrl: `${process.env.REDIRECT_URL_TO_BACKEND_API}/?id=${orderId}&tarnId=${userId}`,
      redirectMode: "POST",
      paymentInstrument: { type: "PAY_PAGE" },
    };

    const payload = Buffer.from(JSON.stringify(paymentPayload)).toString(
      "base64"
    );
    const checksum = await generateChecksumForPhonePe(payload);

    const options = {
      method: "POST",
      url: process.env.PHONEPE_MERCHANT_BASE_URL,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: { request: payload },
    };

    const response = await axios.request(options);

    if (!response.data?.data?.instrumentResponse?.redirectInfo?.url) {
      throw new Error("Redirect URL not found in PhonePe response");
    }

    res
    .status(200)
    .json({
      status:200,
      success: true,
      message: "Payment URL generated successfully",
      url: response.data.data.instrumentResponse.redirectInfo.url,
      token,
      mergedKey,
      date: moment().format("MMMM Do YYYY, h:mm:ss a"),
    });
  } catch (error) {
    console.error("Error in createPaymentAndGenerateUrl:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Payment generation failed",
        error: error.message,
      });
  }
};

const getPhonePeUrlStatusAndUpdatePayment = async (req, res) => {
  try {
    const merchantTransactionId = req.query.id;
    const tarnId = req.query.tarnId;
    const keyIndex = process.env.SALT_INDEX;

    const string =
      `/pg/v1/status/${process.env.PHONEPE_MERCHANT_ID}/${merchantTransactionId}` +
      process.env.PHONEPE_MERCHANT_KEY;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256 + "###" + keyIndex;

    const option = {
      method: "GET",
      url: `${process.env.PHONEPE_MERCHANT_STATUS_URL}/${process.env.PHONEPE_MERCHANT_ID}/${merchantTransactionId}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": process.env.PHONEPE_MERCHANT_ID,
      },
    };

    const response = await axios.request(option);
    const paymentStatus = response.data.code;
    const paymentDetails = JSON.stringify(response.data);
    const isPaymentPaid = paymentStatus === "PAYMENT_SUCCESS";

    const query = `UPDATE rajlaxmi_payment SET status = ?, paymentDetails = ?, isPaymentPaid = ? WHERE id = ?`;
    await withConnection(async (connection) =>
      connection.execute(query, [
        paymentStatus,
        paymentDetails,
        isPaymentPaid,
        tarnId,
      ])
    );

    const redirectUrl = isPaymentPaid
      ? process.env.REDIRECT_URL_TO_SUCCESS_PAGE_RAJLAXMI
      : process.env.REDIRECT_URL_TO_FAILURE_PAGE_RAJLAXMI;
    res.redirect(redirectUrl);
  } catch (err) {
    console.error("Error fetching PhonePe status or updating database:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  createPaymentAndGenerateUrl,
  getPhonePeUrlStatusAndUpdatePayment,
};
