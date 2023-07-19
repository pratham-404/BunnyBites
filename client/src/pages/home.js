import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useGetUserId } from "../hooks/useGetUserID";

import { Link, useNavigate } from "react-router-dom";
import { SavedRecipe } from "./saved-recipe";

export const Home = () => {
	const userId = useGetUserId();
	const [recipes, setRecipes] = useState([]);
	const [savedRecipes, setSavedRecipes] = useState([]);
	const [cookies, _] = useCookies(["access_token"]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchRecipe = async () => {
			try {
				const res = await axios.get("http://localhost:3001/recipes");
				setRecipes(res.data);
			} catch (error) {
				console.log(error);
				navigate("/error", { state: { code: "Network Error", message: "Unable to connect to the server. Please check your internet connection and try again." } });
			}
		};

		const fetchSavedRecipe = async () => {
			try {
				const res = await axios.get(`http://localhost:3001/recipes/save/ids/${userId}`, { headers: { authorization: cookies.access_token } });
				setSavedRecipes(res.data.savedRecipes);
			} catch (error) {
				navigate("/error", { state: { code: "Network Error", message: "Unable to connect to the server. Please check your internet connection and try again." } });
			}
		};

		fetchRecipe();
		if (cookies.access_token) fetchSavedRecipe();
	}, []);

	const saveRecipe = async (recipeId) => {
		try {
			const res = await axios.put("http://localhost:3001/recipes/save", { recipeId, userId }, { headers: { authorization: cookies.access_token } });
			setSavedRecipes((prevSavedRecipes) => [...prevSavedRecipes, recipeId]);
		} catch (error) {
			navigate("/error", { state: { code: "Network Error", message: "Unable to connect to the server. Please check your internet connection and try again." } });
		}
	};
	
	const unsaveRecipe = async (recipeId) => {
		try {
			const res = await axios.put("http://localhost:3001/recipes/unsave", { recipeId, userId }, { headers: { authorization: cookies.access_token } });
			setSavedRecipes((prevSavedRecipes) => prevSavedRecipes.filter((id) => id !== recipeId));
		} catch (error) {
			navigate("/error", { state: { code: "Network Error", message: "Unable to connect to the server. Please check your internet connection and try again." } });
		}
	};

	const isRecipeSaved = (id) => (savedRecipes && savedRecipes.length > 0 ? savedRecipes.includes(id) : false);
	// const isRecipeSaved = (id) => (savedRecipes.length == 0 ? false : savedRecipes.includes(id));

	return (
		<div>
			{/* bg-gray-100 dark:bg-gray-800 bg-opacity-60 dark:bg-opacity-60 */}
			<section className="text-gray-600 dark:text-gray-400 body-font">
				<div className="container md:px-0 sm:px-3 mx-auto flex flex-col justify-center items-center">
					{recipes.map((recipe) => (
						<div className="p-4 md:py-7 mb-5 sm:w-1/2 md:w-3/4 xl:w-1/2" key={recipe._id}>
							<div className="border-2 border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
								<img className="max-h-96 w-full object-cover object-center" src={recipe.imageURL} alt={recipe.name} />
								<div className="p-6 bg-gray-100 dark:bg-gray-800 bg-opacity-60 dark:bg-opacity-60">
									<div className="flex flex-wrap md:flex-row">
										<div>
											<h1 className="title-font text-lg md:text-xl lg:text-2xl font-medium text-gray-900 dark:text-white mb-3">{recipe.name}</h1>
										</div>
										{cookies.access_token && (
											<div className="flex ml-auto ">
												<button onClick={() => (isRecipeSaved(recipe._id) ? unsaveRecipe(recipe._id) : saveRecipe(recipe._id))}>
													<svg className={`w-6 h-6 text-lg md:text-xl lg:text-2xl ${isRecipeSaved(recipe._id) ? "text-orange-600" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
														<path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
													</svg>
												</button>
											</div>
										)}
									</div>

									<Link to={`/complete-recipe/${recipe._id}`} className="text-orange-600 inline-flex items-center md:mb-2 lg:mb-0 text-sm md:text-base lg:text-lg">
										Complete Recipe
										<svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
											<path d="M5 12h14"></path>
											<path d="M12 5l7 7-7 7"></path>
										</svg>
									</Link>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	);
};
