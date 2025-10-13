import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import user from "../models/user.js";
import bcrypt from "bcryptjs";
import "dotenv/config";

export const signup = async (req, res) => {
    const { fullname, email, password } = req.body;
    try {
        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be atleast 6 characters" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "invalid email" });
        }

        const existingUser = await user.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);

        const newuser = new user({
            fullname,
            email,
            password: hashedpassword,
        });

        if (newuser) {
            await newuser.save();
            res.status(201).json({
                _id: newuser._id,
                fullname: newuser.fullname,
                email: newuser.email,
                profilepic: newuser.profilepic,
            });
            try {
                await sendWelcomeEmail(newuser.email, newuser.fullname, process.env.CLIENT_URL);
            } catch (error) {
                console.log("failed to send welcome emails");
            }
        } else {
            res.status(400).json({ message: "invalid user data" });
        }
    } catch (error) {
        console.log("error in signup:", error);
        res.status(500).json({ message: "internal server error" });
    }
};
