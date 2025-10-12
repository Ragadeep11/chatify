import user from "../models/user.js"
import bcrypt from "bcryptjs"
// import { generateToken } from "../utils/generateToken.js" // uncomment if defined

export const signup = async (req, res) => {
    const { fullname, email, password } = req.body;
    try {
        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be atleast 6 characters" });
        }

        // check if email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "invalid email" });
        }

        // ✅ FIX 1: rename this variable to avoid shadowing the imported `user` model
        const existingUser = await user.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);

        // ✅ FIX 2: save hashedpassword properly as `password` field in DB
        const newuser = new user({
            fullname,
            email,
            password: hashedpassword, // fixed field name
        });

        if (newuser) {
            // ✅ optional: only call if defined
            // generateToken(newuser._id, res);

            await newuser.save();
            res.status(201).json({
                _id: newuser._id,
                fullname: newuser.fullname,
                email: newuser.email,
                profilepic: newuser.profilepic,
            });
        } else {
            res.status(400).json({ message: "invalid user data" });
        }
    } catch (error) {
        console.log("error in signup:", error);
        res.status(500).json({ message: "internal server error" });
    }
};
