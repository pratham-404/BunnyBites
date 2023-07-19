import { useContext } from "react";
import { Icons, TextColors } from "./Assets.js";

import { AppContext } from "../App";

export const Alert = () => {
	const { alertInfo, setAlertInfo } = useContext(AppContext);

	// const removeAlert = () => {
	// 	if (alertInfo.visibility) {
	// 		setTimeout(() => {
	// 			alertInfo.visibility && setAlertInfo({ ...alertInfo, visibility: false });
	// 		}, 3000);
	// 	}
	// };
	// removeAlert();

	const removeAlertNow = () => setAlertInfo({ ...alertInfo, visibility: false });

	return (
		<div className={`${alertInfo.visibility ? "visible" : "hidden"}`}>
			<div className="pt-2 pb-5 w-1/2 text-center mx-auto">
				{/*  */}
				<div role="alert" className="rounded-xl border bg-gray-100 dark:bg-gray-800 bg-opacity-60 dark:bg-opacity-60 p-2 shadow-lg shadow-gray-300 dark:shadow-gray-700 border-gray-100 dark:border-gray-800">
					<div className="flex items-start gap-4">
						<div className="mt-2 ml-4 align-middle" style={{ width: "20px", height: "20px" }}>
							<img src={Icons[alertInfo.icon]} alt="icon" />
						</div>

						<div className="flex-1">
							<strong className={`${`${TextColors[alertInfo.titleColor]}`} block font-medium`}>{alertInfo.title}</strong>

							<p className="mt-1 text-sm text-gray-700 dark:text-gray-200">{alertInfo.info}</p>
						</div>

						<button className="text-gray-500 transition hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-500" onClick={removeAlertNow}>
							<span className="sr-only">Dismiss popup</span>

							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
								<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
