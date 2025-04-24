import { hashPassword, comparePassword } from "../services/password.service.js";
import { generateToken } from "../services/token.service.js";
import { findUserByEmailOrUsername, createUser } from "../services/user.service.js";

export const signup = async (req, res) => {
  const { username, email, password, first_name, last_name } = req.body;

  try {
    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        error: "Username, email, and password fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await findUserByEmailOrUsername(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const user = await createUser({
      username,
      email,
      password: hashedPassword,
      first_name,
      last_name,
    });

    // Generate JWT token
    const token = generateToken({ userId: user.user_id });

    // Respond with user data and token
    res.status(201).json({
      message: "User created successfully",
      user: { ...user.toJSON(), password: undefined }, // Ensure password is not included in the response
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
    // Find user by email or username
    const user = await findUserByEmailOrUsername(emailorUsername);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or username" });
    }

    // Compare passwords
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = generateToken({ userId: user.user_id });

    // Respond with user data and token
    res.status(200).json({
      message: "Login successful",
      user: { ...user.toJSON(), password: undefined }, // Ensure password is not included in the response
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
