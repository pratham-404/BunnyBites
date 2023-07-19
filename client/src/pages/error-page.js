import { Link, useLocation } from "react-router-dom";

export const ErrorPage = () => {
	const location = useLocation();
	const { code = "404", message = "We can't find that page." } = location.state || {};

	return (
		<div className="flex justify-center items-center my-20 sm:my-24 md:my-32 xl:my-48 text-gray-950 dark:text-white">
			<div className="text-center">
				<h1 className="font-black text-gray-600 text-5xl sm:text-7xl md:text-9xl dark:text-orange-700">{code}</h1>

				<p className="text-2xl md:text-4xl font-bold tracking-tight text-gray-500 dark:text-gray-400">Uh-oh!</p>

				<p className="mt-4">{message}</p>

				<Link to="/" className="inline-block px-5 py-3 mt-6 text-sm font-medium text-white bg-orange-600 rounded hover:bg-orange-700 focus:outline-none focus:ring">
					Go Back Home
				</Link>
			</div>
		</div>
	);
};
