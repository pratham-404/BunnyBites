import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import { mongoose } from "mongoose";

import { UserModel } from "../models/Users.js";

import { config } from "dotenv"; // npm i dotenv
config();

const router = express.Router();

router.post("/register", async (req, res) => {
	const { username, password } = req.body;
	const newUser = new UserModel({ username, password });

	try {
		await newUser.validate();

		const existingUser = await UserModel.findOne({ username });
		if (existingUser) {
			return res.status(409).json({ message: "User already exists" });
		}

		const hashedPassword = await bcrypt.hash(password, parseInt(process.env.HASH_SALT));
		newUser.password = hashedPassword;
		await newUser.save();

		res.status(201).json({ message: "User registered successfully" });
	} catch (error) {
		handleRouteError(res, error);
	}
});

router.post("/login", async (req, res) => {
	const { username, password } = req.body;
	const user = new UserModel({ username, password });

	try {
		await user.validate();

		const existingUser = await UserModel.findOne({ username });
		if (!existingUser) {
			return res.status(404).json({ message: "User doesn't exist" });
		}

		const isPasswordValid = await bcrypt.compare(password, existingUser.password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: "Username or password is incorrect" });
		}

		const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET_TOKEN);
		res.status(200).json({ token, userId: existingUser._id, message: "Login successful" });
	} catch (error) {
		handleRouteError(res, error);
	}
});

function handleRouteError(res, error) {
	if (error instanceof mongoose.Error.ValidationError) {
		const errors = {};
		for (const field in error.errors) {
			errors[field] = error.errors[field].message;
		}
		return res.status(400).json({ errors });
	}
	// console.error(error);
	return res.status(500).json({ message: "Internal Server Error" });
}

export { router as userRouter };

export const verifyToken = (req, res, next) => {
	const token = req.headers.authorization;
	if (token) {
		jwt.verify(token, process.env.JWT_SECRET_TOKEN, (error) => {
			if (error) return res.status(403).json({ error: "Forbidden: Invalid token" });
			next();
		});
	} else {
		res.status(401).json({ error: "Unauthorized: Token missing" });
	}
};
