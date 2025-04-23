const bcrypt = require("bcrypt");
const { User } = require("../../models");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const signup = async (req, res) => {
  const { username, email, password, first_name, last_name } = req.body;
  try {
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Username, email, and password fields are required" });
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });
    console.log("existingUser", existingUser);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashPassword,
      first_name,
      last_name,
    });

    const token = jwt.sign(
      { userId: user.user_id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "User created successfully",
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { emailorUsername, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: emailorUsername }, { username: emailorUsername }],
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or username" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const updateProfile = async (req, res) => {
    const { first_name, last_name, bio } = req.body;
    const userId = req.user.userId;
    console.log("userId",userId);
    
  
    try {
      const user = await User.findByPk(userId);
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
  
module.exports = { signup, login, updateProfile };
