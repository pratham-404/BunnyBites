import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";

import { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";

import { Icons } from "./Assets.js";

export const Navbar = () => {
	const systemMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
	const [darkMode, setDarkMode] = useState(systemMode);

	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
	};

	useEffect(() => {
		if (darkMode) {
			document.body.classList.add("dark", "bg-gray-900");
			document.body.style.backgroundImage = `url(${Icons["darkDoodleBg"]})`;
		} else {
			document.body.classList.remove("dark", "bg-gray-900");
			document.body.style.backgroundImage = `url(${Icons["lightDoodleBg"]})`;
		}
	}, [darkMode]);

	const [cookies, setCookies] = useCookies(["access_token"]);
	const navigate = useNavigate();

	const { setAlertInfo } = useContext(AppContext);

	const logout = () => {
		setAlertInfo({ visibility: true, title: "Logout Successful", titleColor: "green", info: "Nice to have you visit again!", icon: "greentickIcon" });
		setCookies("access_token", "");
		window.localStorage.removeItem("userId");
		navigate("/", { replace: true });
	};

	const [accordion, setAccordion] = useState(false);

	// const removeAccordion = () => {
	// 	if (accordion) {
	// 		setTimeout(() => {
	// 			accordion && setAccordion(!accordion);
	// 		}, 3000);
	// 	}
	// };
	// removeAccordion();

	return (
		<header className="bg-white dark:bg-gray-900">
			<div className="mx-auto max-w-screen-xl md:px-10 lg:px-8">
				<div className="flex my-1 h-16 items-center justify-between">
					<div className="md:flex md:items-center md:gap-12">
						<Link className="block text-orange-600 dark:text-orange-600 flex flex-row justify-center content-center" to="/">
							<div className="ml-4 align-middle" style={{ width: "35px", height: "35px" }}>
								<img src={Icons["mainIcon"]} alt="icon" />
							</div>
							<div>
								<p className="my-1 sm:ml-4 align-middle md:text-xl text-lg title-font font-medium">BunnyBites</p>
							</div>
						</Link>
					</div>

					{cookies.access_token && (
						<div className="hidden md:block">
							<nav aria-label="Global">
								<ul className="flex items-center gap-6 font-medium">
									<li>
										<Link className="text-gray-700 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75" to="/create-recipe">
											Create-Recipe
										</Link>
									</li>

									<li>
										<Link className="text-gray-700 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75" to="/saved-recipe">
											Saved-Recipe
										</Link>
									</li>
								</ul>
							</nav>
						</div>
					)}

					<div className="flex items-center sm:gap-4 gap-2">
						<div className="sm:flex sm:gap-4">
							{!cookies.access_token ? (
								<Link className="rounded-md bg-orange-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-orange-700" to="/auth">
									Login | Register
								</Link>
							) : (
								<Link className="rounded-md bg-orange-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-orange-700" onClick={logout}>
									Logout
								</Link>
							)}
						</div>

						<div className="block">
							<button className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75 dark:bg-gray-800 dark:text-white dark:hover:text-white/75" onClick={toggleDarkMode}>
								{darkMode ? (
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-orange-600 w-6 h-6">
										<path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
									</svg>
								) : (
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-orange-600 w-6 h-6">
										<path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
									</svg>
								)}
							</button>
						</div>

						{cookies.access_token && (
							<div className="block md:hidden">
								<button onClick={() => setAccordion(!accordion)} className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75 dark:bg-gray-800 dark:text-white dark:hover:text-white/75">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
										<path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
									</svg>
								</button>
							</div>
						)}
					</div>
				</div>
				{cookies.access_token && accordion && (
					<div className="block md:hidden">
						<ul className="flex flex-col text-center text-gray-700 dark:text-white">
							<li className="py-1">
								<Link to="/create-recipe">Create-Recipe</Link>
							</li>
							<li className="py-1">
								<Link to="/saved-recipe">Saved-Recipe</Link>
							</li>
						</ul>
					</div>
				)}
			</div>
		</header>
	);
};
