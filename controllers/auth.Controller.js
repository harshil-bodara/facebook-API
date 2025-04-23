
const { hashPassword, comparePassword } = require("../services/password.service");
const { generateToken } = require("../services/token.service");
const { findUserByEmailOrUsername,createUser } = require("../services/user.service");
const { User } = require("../models");

const signup = async (req, res) => {
  const { username, email, password, first_name, last_name } = req.body;
  try {
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Username, email, and password fields are required" });
    }

    const existingUser = await findUserByEmailOrUsername(email);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const user = await createUser({
      username,
      email,
      password: hashedPassword,
      first_name,
      last_name,
    });

    const token = await generateToken({ userId: user.user_id });

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
   
    const user = await findUserByEmailOrUsername(emailorUsername)

    if (!user) {
      return res.status(401).json({ message: "Invalid email or username" });
    }

    const isMatch = await comparePassword(password,user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const payload={
      userId: user.user_id
    }
    const token=generateToken(payload)
    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



  
module.exports = { signup, login };
