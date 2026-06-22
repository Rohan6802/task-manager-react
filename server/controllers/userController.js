import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Helper functionto generate jwt token string signed by secret key
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc Register a new User
// @route POST /api/users/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }
    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Resistration Error", error: error.message });
  }
};

// @desc Authentication a user & get token (login)
// @Route POST /api/users/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invaild email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Login Error", error: error.message });
  }
};
