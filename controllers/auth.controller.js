import { hashPassword, comparePassword } from "../utils/passwordHelper.js";
import { generateToken } from "../utils/jwt.utils.js";
import userService from "../services/user.service.js";
import transporter from "../config/nodemailer.config.js";


// auth api 
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

// auth forgotPassword and resetPassword
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log("email",email);
  

  try {
    const user = await userService.findUserByEmailOrUsername(email);
    console.log("user",user);
    
    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("otp",otp);


    await userService.updateUser(user.user_id, {
      reset_otp: otp,
      reset_otp_expires: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset OTP",
      html: `
        <p>Hello ${user.username},</p>
        <p>Your password reset OTP is: <strong>${otp}</strong></p>
        <p>It will expire in 10 minutes.</p>
      `,
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await userService.verifyResetOtp(email, otp);
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await userService.verifyResetOtp(email, otp);
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const hashedPassword = await hashPassword(newPassword);

    await userService.updateUser(user.user_id, {
      password: hashedPassword,
      reset_otp: null,
      reset_otp_expires: null,
    });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


