import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import { Icons } from "../components/Assets";

import { useFormik } from "formik";
import { userValidationSchema } from "./yupValidations";

export const Register = (props) => {
	const { setAlertInfo } = useContext(AppContext);
	const navigate = useNavigate();

	const formik = useFormik({
		initialValues: {
			username: "",
			password: "",
		},
		validationSchema: userValidationSchema,
		onSubmit: async (values) => {
			try {
				const res = await axios.post("http://localhost:3001/auth/register", { username: values.username, password: values.password });
				if (res.status === 201) {
					props.setLoginpage(true);
					setAlertInfo({ visibility: true, title: "Registration Completed", titleColor: "green", info: "Now you can log in to your account", icon: "greentickIcon" });
				}
			} catch (error) {
				if (error.response) {
					switch (error.response.status) {
						case 400:
							setAlertInfo({ visibility: true, title: "Invalid Input", titleColor: "red", info: "Invalid username or password", icon: "redcrossIcon" });
							break;
						case 409:
							setAlertInfo({ visibility: true, title: "User already exists", titleColor: "red", info: "Try creating account with different username", icon: "redcrossIcon" });
							break;
						default:
							setAlertInfo({ visibility: true, title: "Internal Server Error", titleColor: "red", info: "Error at Server side..", icon: "redcrossIcon" });
							break;
					}
				} else {
					navigate("/error", { state: { code: "Network Error", message: "Unable to connect to the server. Please check your internet connection and try again." } });
				}
			}
		},
	});

	return (
		<div>
			<section className="text-gray-600 dark:text-gray-400 body-font">
				<div className="container sm:pt-8 md:pt-16 xl:pt-0 px-5 mx-auto flex flex-wrap flex-col md:flex-row items-center">
					<div className="text-center lg:w-3/5 md:w-1/2 flex flex-wrap justify-center">
						<div className="lg:w-2/3">
							<img className="h-auto w-full" src={Icons["register"]} alt="icon" />
						</div>
					</div>
					<form onSubmit={formik.handleSubmit} className="lg:w-2/6 md:w-1/2 bg-gray-100 dark:bg-gray-800 bg-opacity-60 dark:bg-opacity-60 rounded-lg p-8 flex flex-col md:mr-auto w-full mt-5 md:mt-0 h-1/2">
						<h2 className="text-gray-900 dark:text-white text-lg font-medium title-font mb-5">Register</h2>
						<div className="relative mb-4">
							<label htmlFor="username" className="leading-7 text-gray-700 dark:text-gray-200">
								Username
							</label>
							{formik.touched.username && formik.errors.username && <div className="text-sm text-red-600">{formik.errors.username}</div>}
							<input type="text" id="username" name="username" value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full bg-white dark:bg-gray-600 dark:bg-opacity-20 dark:focus:bg-transparent dark:focus:ring-2 dark:focus:ring-orange-900 rounded border border-gray-300 dark:border-gray-600 dark:focus:border-orange-500 focus:ring-2 focus:ring-orange-300 text-base outline-none text-gray-700 dark:text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
						</div>
						<div className="relative mb-4">
							<label htmlFor="password" className="leading-7 text-gray-700 dark:text-gray-200">
								Password
							</label>
							{formik.touched.password && formik.errors.password && <div className="text-sm text-red-600">{formik.errors.password}</div>}
							<input type="password" id="password" name="password" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} className="w-full bg-white dark:bg-gray-600 dark:bg-opacity-20 dark:focus:bg-transparent dark:focus:ring-2 dark:focus:ring-orange-900 rounded border border-gray-300 dark:border-gray-600 dark:focus:border-orange-500 focus:ring-2 focus:ring-orange-300 text-base outline-none text-gray-700 dark:text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
						</div>
						<button type="submit" className="text-white bg-orange-600 border-0 py-2 px-8 focus:outline-none hover:bg-orange-700 rounded text-md">
							Register
						</button>
					</form>
				</div>
			</section>
		</div>
	);
};
