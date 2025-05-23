import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import { authenticate, authorizeAdmin } from "./middlewares/authMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());

// Middleware
app.use(
	cors({
		origin: (origin, callback) => {
			// Allow requests with no origin (like mobile apps or curl requests)
			if (!origin) return callback(null, true);
			// Allow only the client URL from .env
			if (origin === process.env.CLIENT_URL) {
				return callback(null, true);
			}
			return callback(new Error("Not allowed by CORS"));
		},
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE"],
	})
);

app.use(express.static("public"));
// Middleware to parse JSON and URL-encoded data
// This is important for handling form submissions and JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.send("API is running...");
});

app.use("/api/v1/users", authenticate, authorizeAdmin, userRoutes);
app.use("/api/v1/jobs", authenticate, jobRoutes);
app.use("/api/v1/auth", authRoutes);

const startServer = async () => {
	try {
		await connectDB();
		app.listen(PORT, () => {
			console.log(`🚀 Server is running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Error starting server:", error.message);
		process.exit(1); // Exit the process with failure
	}
};

startServer();
