import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { genrateVerificationToken } from "../utils/genrateVerificationToken.js";
import { genrateTokenAndSetCookie } from "../utils/genrateTokenAndSetCookie.js";
import {
  sendResetPasswordEmail,
  sendResetPasswordSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mail/emails.js";
import crypto from "crypto";
export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      throw new Error("All fields must be provided");
    }
    // Check if user exists
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = genrateVerificationToken();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationExpires: Date.now() + 24 * 60 * 60 * 1000, // 24h
    });
    await user.save();
    // jwt token
    genrateTokenAndSetCookie(res, user._id);
    await sendVerificationEmail(user.email, verificationToken);
    res.json({
      success: true,
      message: "User registered successfully",
      user: {
        ...user._doc,
        password: null, // remove password from response
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid or Expired verification code",
      });
    }
    user.isVerfied = true;
    user.verificationToken = null;
    user.verificationExpires = null;
    await user.save();
    await sendWelcomeEmail(user.email, user.name);
    res.json({ success: true, message: "Email verifed successfull" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new Error("All fields must be provided");
    }
    const user = await User.findOne({ email });
    if (!user || !user.isVerfied) {
      throw new Error("User not found or not verified");
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    genrateTokenAndSetCookie(res, user._id);
    user.lastLogin = new Date();
    await user.save();
    res.json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: null, // remove password from response
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
};
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10min
    await user.save();
    await sendResetPasswordEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );
    res.json({
      success: true,
      message: "Password reset link sent to your " + user.email,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
export const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      throw new Error("Invalid or expired reset password token");
    }
    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    await sendResetPasswordSuccessEmail(user.email);
    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({
      success: true,
      user: {
        ...user._doc,
        password: null, // remove password from response
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
