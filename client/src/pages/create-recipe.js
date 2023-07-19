import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import TextareaAutosize from "react-textarea-autosize";
import { Style } from "../components/Assets";
import { useGetUserId } from "../hooks/useGetUserID";

import { useFormik } from "formik";
import { recipeValidationSchema } from "./yupValidations";

export const CreateRecipe = () => {
	const navigate = useNavigate();
	const [cookies, _] = useCookies(["access_token"]);
	const userId = useGetUserId();

	const formik = useFormik({
		initialValues: {
			name: "",
			ingredients: [""],
			instructions: "",
			imageURL: "",
			cookingTime: 0,
			userOwner: userId,
		},
		validationSchema: recipeValidationSchema,
		onSubmit: async (values) => {
			try {
				await axios.post("http://localhost:3001/recipes", values, { headers: { authorization: cookies.access_token } });
				navigate("/");
			} catch (error) {
				if (error.response) {
					navigate("/error", { state: { code: error.response.status, message: "Internal Server Error" } });
				}
				navigate("/error", { state: { code: "Network Error", message: "Unable to connect to the server. Please check your internet connection and try again." } });
			}
		},
	});

	const addIngredients = () => {
		formik.setFieldValue("ingredients", [...formik.values.ingredients, ""]);
	};

	const handleIngredientChange = (e, idx) => {
		const { value } = e.target;
		formik.setFieldValue(`ingredients[${idx}]`, value);
	};

	useEffect(() => {
		const checkAccessToken = () => {
			if (!cookies.access_token) {
				navigate("/error", { state: { code: 401, message: "Authentication required" } });
			}
		};

		checkAccessToken();
	}, [cookies.access_token, navigate]);

	if (!cookies.access_token) {
		return null;
	}

	return (
		<div>
			{!cookies.access_token && navigate("/error")}
			<div className="mx-auto pt-5 px-4 sm:px-6 lg:px-8 text-gray-950 dark:text-white">
				<div className="mx-auto text-center">
					<p className={`text-2xl sm:text-3xl text-orange-600`}>Create Recipe</p>
				</div>
			</div>
			<div>
				<section className="">
					<div className="container xl:px-32 md:px-12 py-10 mx-auto items-center md:flex-row">
						<form className="flex flex-col bg-gray-100 dark:bg-gray-800 bg-opacity-60 dark:bg-opacity-60 rounded-lg pt-7 pb-5 px-10" onSubmit={formik.handleSubmit}>
							<div className="grid gap-6 mb-6 md:grid-cols-3">
								<div>
									<div className="flex flex-row">
										<label htmlFor="name" className={`${Style.inputLabel} mr-auto`}>
											Recipe Name
										</label>
										{formik.touched.name && formik.errors.name && <div className="text-sm text-red-600">{formik.errors.name}</div>}
									</div>
									<input {...formik.getFieldProps("name")} name="name" id="name" type="text" className={`${Style.input}`} placeholder="E.g., Vegan Lentil Curry" />
								</div>
								<div>
									<div className="flex xl:flex-row">
										<label htmlFor="cookingTime" className={`${Style.inputLabel} mr-auto`}>
											Cooking Time (min)
										</label>
										{formik.touched.cookingTime && formik.errors.cookingTime && <div className="text-sm text-red-600">{formik.errors.cookingTime}</div>}
									</div>
									<input {...formik.getFieldProps("cookingTime")} name="cookingTime" id="cookingTime" type="number" className={`${Style.input}`} placeholder="E.g., 30" />
								</div>
								<div>
									<div className="flex xl:flex-row">
										<label htmlFor="imageURL" className={`${Style.inputLabel} mr-auto`}>
											Image URL
										</label>
										{formik.touched.imageURL && formik.errors.imageURL && <div className="text-sm text-red-600">{formik.errors.imageURL}</div>}
									</div>
									<input {...formik.getFieldProps("imageURL")} name="imageURL" id="imageURL" type="text" className={`${Style.input}`} placeholder="E.g., https://example.com/image.jpg" />
								</div>
							</div>

							<div className="flex flex-row">
								<div className="mr-2">
									<label htmlFor="ingredients" className={`${Style.inputLabel} `}>
										Ingredients
									</label>
								</div>
								<div className="mr-auto">
									<button onClick={addIngredients} type="button" className={`rounded-xl bg-orange-600 mx-2 px-2 py-1 text-sm font-medium text-white shadow hover:bg-orange-700`}>
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={"w-6 h-6"}>
											<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									</button>
								</div>
							</div>

							<div className="grid gap-6 mb-6 md:grid-cols-3">
								{formik.values.ingredients.map((ingredient, idx) => {
									const ingredientFieldName = `ingredients[${idx}]`;
									const ingredientFieldProps = formik.getFieldProps(ingredientFieldName);

									const deleteIngredient = () => {
										const updatedIngredients = [...formik.values.ingredients];
										updatedIngredients.splice(idx, 1);
										formik.setFieldValue("ingredients", updatedIngredients);
									};

									return (
										<div key={idx}>
											<div className="text-right">{formik.touched.ingredients && formik.errors.ingredients && <div className="text-sm text-red-600 mb-2">{formik.errors.ingredients[idx]}</div>}</div>
											<div className="flex flex-row">
												<div className="w-full">
													<input {...ingredientFieldProps} type="text" className={`${Style.input}`} placeholder={!idx ? "E.g., Red Lentils" : ""} />
												</div>
												<div>
													<button className="ml-1 mt-3" onClick={deleteIngredient}>
														<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="text-orange-600 w-5 h-5">
															<path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
														</svg>
													</button>
												</div>
											</div>
										</div>
									);
								})}
							</div>

							<div className="mb-6">
								<div className="flex xl:flex-row">
									<label htmlFor="instructions" className={`${Style.inputLabel} mr-auto`}>
										Instructions
									</label>
									{formik.touched.instructions && formik.errors.instructions && <div className="text-sm text-red-600">{formik.errors.instructions}</div>}
								</div>
								<TextareaAutosize {...formik.getFieldProps("instructions")} name="instructions" id="instructions" className={`${Style.input}`} minRows={4} placeholder="E.g., Step 1: Heat olive oil in a pan..." />
							</div>

							<div className="flex justify-center">
								<button type="submit" className={`${Style.button}`}>
									Create Recipe
								</button>
							</div>
						</form>
					</div>
				</section>
			</div>
		</div>
	);
};
