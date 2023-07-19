import express from "express";
import { RecipeModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";
import {mongoose} from "mongoose" 

const router = express.Router();

// Get all recipes
router.get("/", async (req, res) => {
	try {
		const response = await RecipeModel.find({});
		res.json(response);
	} catch (err) {
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Create a new recipe
router.post("/", verifyToken, async (req, res) => {
	try {
		const recipe = new RecipeModel(req.body);
		const response = await recipe.save();
		res.status(201).json(response);
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			const errors = {};
			for (const field in err.errors) {
				errors[field] = err.errors[field].message;
			}
			return res.status(400).json({ errors });
		}
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Save a recipe to user's savedRecipes array
router.put("/save", verifyToken, async (req, res) => {
	try {
		const { recipeId, userId } = req.body;
		const recipe = await RecipeModel.findById(recipeId);
		const user = await UserModel.findById(userId);

		if (!recipe || !user) {
			return res.status(404).json({ error: "Recipe or user not found" });
		}

		if (!user.savedRecipes) {
			user.savedRecipes = [];
		}

		user.savedRecipes.push(recipe);
		await user.save();

		res.json({ savedRecipes: user.savedRecipes });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Remove a recipe from user's savedRecipes array
router.put("/unsave", verifyToken, async (req, res) => {
	try {
		const { recipeId, userId } = req.body;
		const recipe = await RecipeModel.findById(recipeId);
		const user = await UserModel.findById(userId);

		if (!recipe || !user) {
			return res.status(404).json({ error: "Recipe or user not found" });
		}

		user.savedRecipes = user.savedRecipes.filter((savedRecipe) => savedRecipe._id.toString() !== recipeId);
		await user.save();

		res.json({ savedRecipes: user.savedRecipes });
	} catch (err) {
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Get saved recipes by user ID
router.get("/save/ids/:userId", verifyToken, async (req, res) => {
	try {
		const { userId } = req.params;
		const user = await UserModel.findById(userId);

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.json({ savedRecipes: user.savedRecipes });
	} catch (err) {
		res.status(500).json({ error: "Internal Server Error" });
	}
});
6;

// Get full recipe details for saved recipes by user ID
router.get("/save/:userId", verifyToken, async (req, res) => {
	try {
		const { userId } = req.params;
		const user = await UserModel.findById(userId);

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const savedRecipes = await RecipeModel.find({
			_id: { $in: user.savedRecipes },
		});

		res.json(savedRecipes);
	} catch (err) {
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Get recipe from recipeID
router.get("/:recipeId", async (req, res) => {
	try {
		const { recipeId } = req.params;
		const recipe = await RecipeModel.findById(recipeId);

		if (!recipe) {
			return res.status(404).json({ error: "Recipe not found" });
		}

		res.json(recipe);
	} catch (err) {
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// get all recipes with a userOwner Id

// delete a recipe from recipe id

// update a recipe from recipe id

export { router as recipeRouter };
