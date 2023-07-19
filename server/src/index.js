import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import {config} from "dotenv"; // npm i dotenv
config();

import { userRouter } from "./routes/users.js";
import { recipeRouter } from "./routes/recipes.js";

const app = express();

app.use(express.json()); // middleware (frontend -> json -> backend)
app.use(cors()) // resolves issues when making API request from frontend4

app.use("/auth", userRouter);
app.use("/recipes", recipeRouter);

mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@recipe-app.ppygvek.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`);

app.listen(3001, () => console.log("SERVER STARTED"));

// add to package.json => yarn start => nodemon src/index.js
// "scripts": {
//     "start": "nodemon src/index.js"
// },
