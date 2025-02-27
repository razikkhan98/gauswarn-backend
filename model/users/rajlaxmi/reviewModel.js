const { connectToDatabase } = require("../../../config/dbConnection");

// exports.addReview = async (review) => {
//     try {
//         const {
//             uid,
//             user_name,
//             user_email,
//             user_rating
//         } = review;
// console.log(review)
//         const connection = await connectToDatabase();
//         const query = `INSERT INTO rajlaxmi_review (uid, user_name, user_email, user_rating) VALUES (?, ?, ?, ?)`

//         const [results] = await connection.execute(query, [
//             uid,
//             user_name,
//             user_email,
//             user_rating
//         ]);

//         return results;
//     } catch (error) {
//         console.error("Database Error", error);
//         throw error;
//     }
// }


// exports.addReview = async (uid, user_name, user_email, user_rating) => {
//     try {
//         const connection = await connectToDatabase();
//         const query = `
//           INSERT INTO rajlaxmi_review (uid, user_name, user_email, user_rating)
//           VALUES (?, ?, ?, ?)
//         `;
  
//         // const [result] = await connection.execute(query, [
//         //     uid, 
//         //     user_name, 
//         //     user_email, 
//         //     user_rating
//         // ]);
//         // return result.insertId;
//         // Replace undefined with null
//         const values = [
//             user_rating === undefined ? null : user_rating,
//           ];
    
//           const [result] = await connection.execute(query, values);
//           return result.insertId;
        


//     } catch (error) {
//       console.error("Database Error:", error.message);
//       throw error;
//     }
//   };
  
//   // Fetch all reviews
//   exports.getAllReviews = async () => {
//     try {
//         const connection = await connectToDatabase();
//         const query = `SELECT * FROM rajlaxmi_review`;
//         const [rows] = await connection.execute(query);
//         return rows;
      
//     } catch (error) {
//       console.log("error: ", error);
//       throw error;
//     }
//   };
  