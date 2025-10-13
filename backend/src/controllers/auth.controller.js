import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import cloudinary from "../lib/cloudinary.js"; // ✅ removed duplicate import

// Generate JWT
const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// SIGNUP
export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    if (!fullname || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Invalid email" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ fullname, email, password: hashedPassword });
    await newUser.save();

    await sendWelcomeEmail(newUser.email, newUser.fullname, process.env.CLIENT_URL);

    res.status(201).json({
      _id: newUser._id,
      fullname: newUser.fullname,
      email: newUser.email,
      profilepic: newUser.profilepic,
    });
  } catch (error) {
    console.log("Error in signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(400).json({ message: "Invalid credentials" });

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    generateToken(existingUser._id, res);
    res.status(200).json({
      _id: existingUser._id,
      fullname: existingUser.fullname,
      email: existingUser.email,
      profilepic: existingUser.profilepic,
    });
  } catch (error) {
    console.log("Error in login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// LOGOUT
export const logout = (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
};

// UPDATE PROFILE
export const updateprofile = async (req, res) => {
  try {
    const { profilepic } = req.body;
    if (!profilepic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const userid = req.user._id;
    const uploadresponse = await cloudinary.uploader.upload(profilepic);

    // ✅ fixed: changed "user" to "User" (your imported model)
    const updateduser = await User.findByIdAndUpdate(
      userid,
      { profilepic: uploadresponse.secure_url },
      { new: true }
    );

    res.status(200).json(updateduser);
  } catch (error) {
    console.log("Error in updating profile:", error); // ✅ added error detail
    res.status(500).json({ message: "Internal server error" });
  }
};
