// SIGNUP
export const signup = async (req, res) => {
  const { email, password, fullname } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname: fullname || "",   // <-- NOT required anymore
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // send email if fullname exists, else fallback
    await sendWelcomeEmail(
      newUser.email,
      newUser.fullname || "User",
      process.env.CLIENT_URL
    );

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
