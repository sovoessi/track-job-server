import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Middleware to authenticate the user
export const authenticate = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select("-password");
      
        req.user = {
            ...req.user._doc,
            userId: req.user._id
         };
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

// Middleware to check if the user is an admin
export const authorizeAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
}

// Middleware to protect routes
export const protectRoute = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
}