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

    return res.status(201).json({ user });
}


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

    return res.status(200).json({ user });
}