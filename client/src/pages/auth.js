import { useState } from "react";
import { Login } from "./login";
import { Register } from "./register";

export const Auth = () => {
	const [loginpage, setLoginpage] = useState(true);

	return (
		<div>
			<div className="mx-auto pt-5">
				<div className="flex flex-wrap justify-center text-center">
					<button className={`text-2xl sm:text-3xl ${loginpage ? "text-orange-600" : "dark:text-white"}`} onClick={() => setLoginpage(true)}>
						Login
					</button>
					<button className="text-2xl sm:text-4xl dark:text-white">
						<pre> | </pre>
					</button>
					<button className={`text-2xl sm:text-3xl ${!loginpage ? "text-orange-600" : "dark:text-white"}`} onClick={() => setLoginpage(false)}>
						Register
					</button>
				</div>
			</div>
			{loginpage ? <Login setLoginpage={setLoginpage} /> : <Register setLoginpage={setLoginpage} />}
		</div>
	);
};
