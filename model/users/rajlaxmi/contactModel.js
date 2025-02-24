const { connectToDatabase } = require("../../../config/dbConnection");

exports.userContact = async(contactTable) => {
    try{
    const {
     uid,
     user_name,
     user_email,
     user_number,
     title,
     message
    }=contactTable;

    const connection = await connectToDatabase();
    const query = `INSERT INTO rajlaxmi_contact (
    uid, user_name, user_email, user_number, title, message) 
    VALUES(?, ?, ?, ?, ?, ?)`;

    const [results] = await connection.execute(query,[
        uid,
        user_name,
        user_email,
        user_number,
        title,
        message
    ]);

    return results;
    }catch (error){
      console.error(" Database Error", error);
      throw error;
    }
}