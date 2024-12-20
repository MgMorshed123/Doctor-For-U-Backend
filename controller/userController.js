import validator from "validator";
import bcrypt from "bcrypt";
import { userModel } from "../models/userModel";
import jwt from "jsonwebtoken";
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details " });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a Valid Email " });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a Valid Password " });
    }

    // hash user password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);

    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.jwt_Secret);

    res.json({ success: true, token });
  } catch (error) {}
};