import { use } from "react";
import User from "../models/User.js";


export const register = async (req, res) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		return res.status(400).json({ message: "Please provide all values" });
	}

	const userAlreadyExists = await User.findOne({ email });

	if (userAlreadyExists) {
		return res.status(400).json({ message: "User already exists" });
	}

	const user = await User.create({ name, email, password });

    const token = user.createJWT();
    // Set the token as a cookie
    res.cookie("token", token, {    
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

	return res.status(201).json({ user, token });
};

export const login = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ message: "Please provide all values" });
	}

	const user = await User.findOne({ email });

	if (!user) {
		return res.status(401).json({ message: "Invalid credentials" });
	}

	const isPasswordCorrect = await user.comparePassword(password);

	if (!isPasswordCorrect) {
		return res.status(401).json({ message: "Invalid credentials" });
	}

    const token = user.createJWT();
    // Set the token as a cookie
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

	return res.status(200).json({ user, token });
};
