const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Create Token
const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET);
};

// Register User
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({ username, email, password: hashedPassword });
    await user.save();

    // Generate JWT token
    const token = createToken(user._id);

    // Return token and user info (excluding sensitive data)
    res.status(201).json({
      success: true,
      token,
      user: { name: user.username, email: user.email },
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Login User
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare hashed password with provided password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = createToken(user._id);

    // Return both token and user info (make sure to only send non-sensitive info)
    res.json({
      success: true,
      token,
      user: { name: user.username, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};
