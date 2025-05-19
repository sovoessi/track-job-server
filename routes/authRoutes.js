import express from "express";
import {
	register,
	login,
	logout,
	getMe,
} from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/me").get(authenticate, getMe);

export default router;
