"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navigation from "../../components/Navigation";

export default function HomePage() {
	const [buildingData, setBuildingData] = useState(null);
	const [userData, setUserData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				// Fetch building data
				const buildingResponse = await fetch(
					"https://xfb011tfn5.execute-api.us-east-1.amazonaws.com/dev/get-building-data"
				);
				if (!buildingResponse.ok) {
					throw new Error(`HTTP error! status: ${buildingResponse.status}`);
				}
				const buildingDataResult = await buildingResponse.json();
				setBuildingData(buildingDataResult);

				// Fetch user data
				const userResponse = await fetch(
					"https://rksm5pqdlaltlgj5pf6du4glwa0ahmao.lambda-url.us-east-1.on.aws/api/users/66e466025109d007ba69a4df",
					{
						headers: {
							accept: "application/json",
						},
					}
				);
				if (!userResponse.ok) {
					throw new Error(`HTTP error! status: ${userResponse.status}`);
				}
				const userDataResult = await userResponse.json();
				setUserData(userDataResult);
			} catch (e) {
				setError("Failed to fetch data: " + e.message);
				console.error("Fetch error:", e);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	return (
		<div className="flex flex-col min-h-screen bg-gray-50">
			<Navigation />

			<main className="flex-grow container mx-auto px-4 py-8">
				<h2 className="text-3xl font-bold text-gray-800 mb-4">
					Welcome to Location Explorer
				</h2>
				<p className="text-gray-600 mb-4">
					Discover and explore wheelchair-accessible locations in your area. Use our
					interactive map to find friendly and accessible places near you.
				</p>
				<Link
					href="/"
					className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition duration-300"
				>
					Explore Map
				</Link>

				<div className="mt-8">
					<h3 className="text-2xl font-bold text-gray-800 mb-4">Fetched Data:</h3>
					{isLoading && <p>Loading data...</p>}
					{error && <p className="text-red-500">{error}</p>}
					{buildingData && (
						<div className="mb-4">
							<h4 className="text-xl font-semibold text-gray-700 mb-2">
								Building Data:
							</h4>
							<pre className="bg-gray-100 text-gray-800 p-4 rounded overflow-x-auto">
								{JSON.stringify(buildingData, null, 2)}
							</pre>
						</div>
					)}
					{userData && (
						<div>
							<h4 className="text-xl font-semibold text-gray-700 mb-2">User Data:</h4>
							<pre className="bg-gray-100 text-gray-800 p-4 rounded overflow-x-auto">
								{JSON.stringify(userData, null, 2)}
							</pre>
						</div>
					)}
				</div>
			</main>

			<footer className="bg-white shadow-sm p-4 border-t border-gray-200">
				<p className="text-center text-gray-600">
					&copy; 2024 Location Explorer. All rights reserved.
				</p>
			</footer>
		</div>
	);
}
