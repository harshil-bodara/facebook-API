
import userService from "../services/user.service.js";
import { deleteImageFromCloudinary, extractPublicId } from "../utils/cloudinary.utils.js";

export const updateProfile = async (req, res) => {
  const { first_name, last_name, bio } = req.body;
  const userId = req.user.userId;

  console.log("last_name", last_name);
  console.log("first_name", first_name);
  console.log("bio", bio);

  try {
    const user = await userService.findUserById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let profileUrl = user.profile;

    if (req.file) {
      console.log("req.file", req.file);
      
      if (user.profile) {
         const publicId = extractPublicId(user.profile);
              if (publicId) await deleteImageFromCloudinary(publicId);
      }

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
export const   getProfile = async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await userService.findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Successfully fetched user data", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

