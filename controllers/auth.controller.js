import { hashPassword, comparePassword } from "../utils/passwordHelper.js";
import { generateToken } from "../utils/jwt.utils.js";
import userService from "../services/user.service.js";

export const signup = async (req, res) => {
  const { username, email, password, first_name, last_name } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({
        error: "Username, email, and password fields are required",
      });
    }

    const existingUser = await userService.findUserByEmailOrUsername(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const user = await userService.createUser({
      username,
      email,
      password: hashedPassword,
      first_name,
      last_name,
    });

    const token = generateToken({ userId: user.user_id });

    res.status(201).json({
      message: "User created successfully",
      user: { ...user.toJSON(), password: undefined },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { emailorUsername, password } = req.body;

  try {
    const user = await userService.findUserByEmailOrUsername(emailorUsername);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or username" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken({ userId: user.user_id });

    res.status(200).json({
      message: "Login successful",
      user: { ...user.toJSON(), password: undefined },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
