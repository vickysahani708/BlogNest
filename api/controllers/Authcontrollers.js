import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { handleError } from "../helper/handleError.js";

// Validate JWT_SECRET exists
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined');
}

// Helper: Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper: Validate password strength
const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  return password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password);
};

// Helper: Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' } // Token expires in 24 hours
  );
};

// Helper: Set secure cookie
const setAuthCookie = (res, token) => {
  res.cookie('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in production
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    path: '/',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });
};

// 📝 Register User
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return next(handleError(400, "All fields are required"));
    }

    if (!isValidEmail(email)) {
      return next(handleError(400, "Invalid email format"));
    }

    if (!isStrongPassword(password)) {
      return next(handleError(400, "Password must be at least 8 characters with uppercase, lowercase, and number"));
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(handleError(409, "Email already registered"));
    }

    // Hash password with higher cost factor for better security
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      success: true,
      message: 'Registration successful'
    });
  } catch (err) {
    next(handleError(500, err.message));
  }
};

// 🔐 Google Login
export const GoogleloginUser = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;

    // Input validation
    if (!name || !email) {
      return next(handleError(400, "Name and email are required"));
    }

    if (!isValidEmail(email)) {
      return next(handleError(400, "Invalid email format"));
    }

    let user = await User.findOne({ email });

    // Create new user if doesn't exist
    if (!user) {
      // Generate cryptographically secure random password
      const randomPassword = crypto.randomBytes(32).toString('hex');
      const hashedPassword = await bcrypt.hash(randomPassword, 12);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        avatar: avatar || undefined
      });

      user = await newUser.save();
    }

    // Generate token
    const token = generateToken(user);

    // Set cookie
    setAuthCookie(res, token);

    // Remove password from response
    const userResponse = user.toObject({ getters: true });
    delete userResponse.password;

    res.status(200).json({
      success: true,
      user: userResponse,
      message: 'Login successful'
    });
  } catch (err) {
    next(handleError(500, err.message));
  }
};

// 🔑 Login User
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return next(handleError(400, "Email and password are required"));
    }

    // Find user
    const user = await User.findOne({ email });
    
    // Generic error message to prevent user enumeration
    if (!user) {
      return next(handleError(401, "Invalid credentials"));
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(handleError(401, "Invalid credentials"));
    }

    // Generate token
    const token = generateToken(user);

    // Set cookie
    setAuthCookie(res, token);

    // Remove password from response
    const userResponse = user.toObject({ getters: true });
    delete userResponse.password;

    res.status(200).json({
      success: true,
      user: userResponse,
      message: 'Login successful'
    });
  } catch (err) {
    next(handleError(500, err.message));
  }
};

// 🚪 Logout
export const Logout = async (req, res, next) => {
  try {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      path: '/'
    });

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (err) {
    next(handleError(500, err.message));
  }
};