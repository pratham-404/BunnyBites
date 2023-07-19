import "./App.css";
import { Auth } from "./pages/auth";
import { CompleteRecipe } from "./pages/complete-recipe";
import { CreateRecipe } from "./pages/create-recipe";
import { ErrorPage } from "./pages/error-page";
import { Home } from "./pages/home";
import { SavedRecipe } from "./pages/saved-recipe";

import { Navbar } from "./components/Navbar";
import { Alert } from "./components/Alert";

import { createContext, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

export const AppContext = createContext();

function App() {
	const [alertInfo, setAlertInfo] = useState({ visibility: false, title: "sample-title", titleColor: "normal", info: "sample-info", icon: "greentickIcon" });
 
	return (
		<div>
			<AppContext.Provider value={{ alertInfo, setAlertInfo }}>
				<Router>
					<Navbar/>
					<Alert />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/auth" element={<Auth />} />
						<Route path="/create-recipe" element={<CreateRecipe />} />
						<Route path="/saved-recipe" element={<SavedRecipe />} />
						<Route path="/complete-recipe/:recipeId" element={<CompleteRecipe />} />
						<Route path="/error" element={<ErrorPage />} />
						<Route path="*" element={<ErrorPage code="404" message="We can't find that page." />} />
					</Routes>
				</Router>
			</AppContext.Provider>
		</div>
	);
}

export default App;
