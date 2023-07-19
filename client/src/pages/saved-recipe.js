import axios from "axios";
import { useEffect, useState } from "react";

import { useGetUserId } from "../hooks/useGetUserID";

import { useCookies } from "react-cookie";

import { Link, useNavigate } from "react-router-dom";

export const SavedRecipe = () => {
	const userId = useGetUserId();
	const [savedRecipesIds, setSavedRecipesIds] = useState([]);
	const [savedRecipes, setSavedRecipes] = useState([]);
	const [cookies, _] = useCookies(["access_token"]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchSavedRecipesIds = async () => {
			try {
				const res = await axios.get(`http://localhost:3001/recipes/save/ids/${userId}`, { headers: { authorization: cookies.access_token } });
				setSavedRecipesIds(res.data.savedRecipes);
			} catch (error) {
				navigate("/error", { state: { code: "Network Error", message: "Unable to connect to the server. Please check your internet connection and try again." } });
			}
		};

		const fetchSavedRecipes = async () => {
			try {
				const res = await axios.get(`http://localhost:3001/recipes/save/${userId}`, { headers: { authorization: cookies.access_token } });
				setSavedRecipes(res.data);
			} catch (error) {
				navigate("/error", { state: { code: "Network Error", message: "Unable to connect to the server. Please check your internet connection and try again." } });
			}
		};

		if (!cookies.access_token) {
			navigate("/error", { state: { code: 401, message: "Authentication required" } });
		} else {
			fetchSavedRecipesIds();
			fetchSavedRecipes();
		}
	}, [userId, cookies.access_token, navigate]);

	if (!cookies.access_token) {
		return null; // or any loading indicator component
	}

	const saveRecipe = async (recipeId) => {
		try {
			const res = await axios.put("http://localhost:3001/recipes/save", { recipeId, userId }, { headers: { authorization: cookies.access_token } });
			setSavedRecipes((prevSavedRecipes) => [...prevSavedRecipes, res.data.recipe]);
			setSavedRecipesIds((prevSavedRecipesIds) => [...prevSavedRecipesIds, recipeId]);
		} catch (error) {
			navigate("/error", { state: { code: "Network Error", message: "Unable to connect to the server. Please check your internet connection and try again." } });
		}
	};

	const unsaveRecipe = async (recipeId) => {
		try {
			const res = await axios.put("http://localhost:3001/recipes/unsave", { recipeId, userId }, { headers: { authorization: cookies.access_token } });
			setSavedRecipes((prevSavedRecipes) => prevSavedRecipes.filter((recipe) => recipe._id !== recipeId));
			setSavedRecipesIds((prevSavedRecipesIds) => prevSavedRecipesIds.filter((id) => id !== recipeId));
		} catch (error) {
			navigate("/error", { state: { code: "Network Error", message: "Unable to connect to the server. Please check your internet connection and try again." } });
		}
	};

	const isRecipeSaved = (id) => savedRecipesIds.includes(id);

	return (
		<div className="text-gray-900 dark:text-white">
			<div className="mx-auto pt-5 px-4 sm:px-6 lg:px-8">
				<div className="mx-auto text-center">
					<p className={`text-2xl sm:text-3xl text-orange-600`}>Saved Recipe</p>
				</div>
			</div>
			<section className="dark-text-gray-400 body-font">
				<div className="container px-5 py-4 mx-auto">
					<div className="flex flex-wrap justify-center lg:mx-10">
						{savedRecipes?.length === 0 ? (
							<div>
								<div className="grid h-max px-4 py-32 place-content-center">
									<div className="text-center">
										<h1 className="font-black text-gray-600 text-7xl dark:text-orange-700">No Recipe's Saved</h1>
										<p className="mt-4">Try adding some from the Home page...</p>
										<Link to="/" className="inline-block px-5 py-3 mt-4 text-sm font-medium text-white bg-orange-600 rounded hover:bg-orange-700 focus:outline-none focus:ring">
											Go Back Home
										</Link>
									</div>
								</div>
							</div>
						) : (
							savedRecipes.map((recipe) => (
								<div className="lg:w-1/3 md:w-1/2 p-6 w-full" key={recipe._id}>
									<a className="block relative h-48 rounded-t overflow-hidden">
										<img alt="ecommerce" className="object-cover object-center w-full h-full block" src={recipe?.imageURL} />
									</a>
									<div className="bg-gray-100 dark:bg-gray-800 bg-opacity-60 dark:bg-opacity-60 p-4 rounded-b">
										<div className="flex flex-wrap md:flex-row">
											<div>
												<h1 className="title-font text-sm md:text-lg lg:text-xl font-medium text-gray-900 dark:text-white mb-3">{recipe?.name}</h1>
											</div>
											<div className="flex ml-auto ">
												<button onClick={() => (isRecipeSaved(recipe._id) ? unsaveRecipe(recipe._id) : saveRecipe(recipe._id))}>
													<svg className={`w-6 h-6 text-lg md:text-xl lg:text-2xl ${isRecipeSaved(recipe._id) ? "text-orange-600" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
														<path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
													</svg>
												</button>
											</div>
										</div>
										<div>
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
							))
						)}
					</div>
				</div>
			</section>
		</div>
	);
};
