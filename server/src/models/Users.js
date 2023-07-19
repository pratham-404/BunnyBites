import { mongoose } from "mongoose";

export const UserSchema = new mongoose.Schema({
	username: {
	  type: String,
	  required: [true, "Username is a required field"],
	  unique: true,
	  minlength: [8, "Username must be at least 8 characters long"],
	  maxlength: [20, "Username cannot exceed 20 characters"],
	  validate: [
		{
		  validator: function (value) {
			return !/\s/.test(value);
		  },
		  message: "Username cannot contain spaces or newlines",
		},
	  ],
	},
	password: {
	  type: String,
	  required: [true, "Password is a required field"],
	  minlength: [8, "Password must be at least 8 characters long"],
	  validate: [
		{
		  validator: function (value) {
			return /\d/.test(value);
		  },
		  message: "Password must contain at least one numeric value",
		},
		{
		  validator: function (value) {
			return value !== this.username;
		  },
		  message: "Password cannot be the same as the username",
		},
		{
		  validator: function (value) {
			return !/\s/.test(value);
		  },
		  message: "Password cannot contain spaces or newlines",
		},
	  ],
	},
	savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  });
  

// database: recipes, collection: users
export const UserModel = mongoose.model("users", UserSchema);
