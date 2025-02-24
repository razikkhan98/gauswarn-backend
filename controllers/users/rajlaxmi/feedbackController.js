const asyncHandler = require("express-async-handler");
const feedbackModel = require("../../../model/users/rajlaxmi/feedbackModel");

exports.feedback =asyncHandler(async(req ,res)=>{
try{
    const {
    uid,
    user_name,
    user_email,
    feedback
} = req.body;

//Validation
if(!uid && !user_name && !user_email && !feedback){
   return res. status(400).json({message: "Please provide all required fileds"});
}

// New user feedback
const newfeedback = {
    uid,
    user_name,
    user_email,
    feedback
}
 await feedbackModel.feedback(newfeedback);
 return res.status(200).json({success: true , message: "feedback Successfully"});
}catch(error){
    console.error("Database Error", error);
    throw error;
}
});


// Get All Feedback
exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await feedbackModel.getAllFeedback();
    res.status(200).json({ feedback });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.json({ error: "Failed to fetch feedback" });
  }
};
