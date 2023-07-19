import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const CompleteRecipe = () => {
	const { recipeId } = useParams();
	const [recipe, setRecipe] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchRecipe = async () => {
			try {
				const res = await axios.get(`http://localhost:3001/recipes/${recipeId}`);
				setRecipe(res.data);
			} catch (error) {
				navigate("/error", { state: { code: "Network Error", message: "Unable to connect to the server. Please check your internet connection and try again." } });
			}
		};
		fetchRecipe();
	}, [recipeId]);

	return (
		<div className="flex flex-col items-center text-gray-950 dark:text-white">
			<div className="max-w-screen-xl mx-auto pt-5 px-2 sm:px-6 md:px-8 pb-10 lg:px-12">
				<div className="mx-auto text-center">
					<p className="text-2xl md:text-3xl lg:text-4xl text-orange-600">{recipe?.name}</p>
				</div>
			</div>

			<div className="max-w-screen-xl mb-10">
				<img className="max-w-full h-auto object-cover rounded-lg" src={recipe?.imageURL} alt={recipe?.name} />
			</div>

			<div className="max-w-screen-xl mb-10">
				<h2 className="text-xl sm:text-2xl font-medium mb-4 mx-8 sm:mx-16 md:mx-24 xl:mx-48">
					<span className="text-orange-600">Cooking Time: </span>
					<span className="text-md">{recipe?.cookingTime} mins</span>
				</h2>

				<h2 className="text-xl sm:text-2xl font-medium text-orange-600 mb-4 mx-8 sm:mx-16 md:mx-24 xl:mx-48">Ingredients</h2>
				<ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-lg marker:text-orange-600 list-disc list-inside mb-10 mx-8 sm:mx-16 md:mx-24 xl:mx-48">
					{recipe?.ingredients.map((ingredient, index) => (
						<li key={index} className="mb-2">
							{ingredient}
						</li>
					))}
				</ul>

				<h2 className="text-xl sm:text-2xl font-medium text-orange-600 mb-4 mx-8 sm:mx-16 md:mx-24 xl:mx-48">Instructions</h2>
				<ul className="grid grid-cols-1 gap-4 text-lg  marker:text-orange-600 list-disc list-inside mx-8 sm:mx-16 md:mx-24 xl:mx-48">
					{recipe?.instructions.split("\n").map((instruction, index) => (
						<li key={index} className="mb-2">
							{instruction}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};
