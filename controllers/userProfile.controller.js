const User = require("../models/user.model");
const {findUserById}=require("../services/user.service")
const updateProfile = async (req, res) => {
    const { first_name, last_name, bio } = req.body;
    const userId = req.user.userId;
    console.log("userId",userId);
    
  
    try {
      const user = await findUserById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      let profileUrl = user.profile;
  
      if (req.file) {
        console.log("req.file", req.file);
        profileUrl = req.file.path; 
      }
      
  
      const updatedUser = await user.update({
        first_name: first_name || user.first_name,
        last_name: last_name || user.last_name,
        bio: bio || user.bio,
        profile: profileUrl,
      });
  
      res.status(200).json({ message: "User updated successfully", updatedUser });
    } catch (error) {
      console.error("Profile update failed:", error);
      res.status(500).json({ error: error.message });
    }
};
const getUserProfileData=async(req,res)=>{
  const userId=req.user.userId
  try {
    const user=await findUserById(userId)
    if(!user){
      return res.status(404).json({message:"usernot found"})
    }
    res.status(200).json({message:"succesfully data get",user})
  } catch (error) {
    res.status(500).json({ error: error.message });
    
  }
}
module.exports={updateProfile,getUserProfileData}