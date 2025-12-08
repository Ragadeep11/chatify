import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {        // ⭐ FIXED — changed fullname → fullName
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilepic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true } // createAt & updatedAt
);

const user = mongoose.model("user", userSchema);
export default user;
