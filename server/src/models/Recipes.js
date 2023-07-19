import {mongoose} from "mongoose" 

const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is a required field"],
    maxlength: [40, "Name cannot exceed 40 characters"],
  },
  ingredients: [{
    type: String,
    required: [true, "Ingredients are required"],
    maxlength: [40, "Each ingredient cannot exceed 40 characters"],
  }],
  instructions: {
    type: String,
    required: [true, "Instructions are required"],
    maxlength: [1000, "Instructions cannot exceed 1000 characters"],
  },
  imageURL: {
    type: String,
    required: [true, "Image URL is required"],
    validate: {
      validator: function (value) {
        // Regular expression to check if the value is a valid image URL
        return /^(http|https):\/\/[^ "]+$/.test(value);
      },
      message: "Invalid image URL",
    },
  },
  cookingTime: {
    type: Number,
    required: [true, "Cooking time is required"],
  },
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "User owner is required"],
  },
});

// database: recipes, collection: users
export const RecipeModel = mongoose.model("recipes", RecipeSchema);