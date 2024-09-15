"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@propelauth/nextjs/client";
import { createUserProfile, getProfileByEmail, updateUserProfile } from "@/lib/api";
import { redirect } from "next/navigation";

export default function ProfilePage() {
	const { user } = useUser();

	if (!user) {
		redirect("/home");
	}

	const [needsOnboarding, setNeedsOnboarding] = useState(true);
	const [formData, setFormData] = useState({
		email: user?.email || "",
		user_name: "",
		age: 0,
		gender: "",

		mobility: {
			"Wheelchair User": false,
			"Balance/Coordination Difficulties": false,
			"Limited Mobility": false,
		},
		cognitive: {
			"Learning Disability": false,
			"Memory Impairment": false,
			ADHD: false,
			"Processing Speed Difficulty": false,
		},
		hearing: {
			"Mild Hearing Loss": false,
			"Moderate Hearing Loss": false,
			"Severe Hearing Loss": false,
			Deaf: false,
		},
		vision: {
			"Color Blindness": false,
			"Low Vision": false,
			Blindness: false,
			"Night Blindness": false,
		},
		LGBTQ: false,
		other: {
			"Sensory Sensitivities": false,
			Neurodiversity: false,
			"Chronic Illness": false,
		},
	});

	const [submitted, setSubmitted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const getProfileByEmailFromServer = async () => {
			if (user) {
				try {
					const result = await getProfileByEmail(user.email);
					if (result == null) {
						// user needs to be saved
						setNeedsOnboarding(false);
					}
					if (result.exists) {
						// user exists and needs to have data
						setFormData((prevData) => ({ ...prevData, ...result.data }));
						setNeedsOnboarding(false);
					} else {
						setNeedsOnboarding(true);
					}
				} catch (error) {
					throw Error;
				}
			}
		};
		getProfileByEmailFromServer();
	}, [user]);

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]:
				type === "checkbox"
					? checked
					: name === "age"
					? value === ""
						? 0
						: parseInt(value, 10)
					: value,
		}));
	};

	const handleAccessibilityChange = (category, condition) => {
		console.log(category, condition);
		setFormData((prevData) => ({
			...prevData,
			[category]: {
				...prevData[category],
				[condition]: !prevData[category][condition],
			},
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			if (needsOnboarding) {
				await createUserProfile(formData);
			} else {
				await updateUserProfile(formData);
			}

			setSubmitted(true);
			setNeedsOnboarding(false);
		} catch (error) {
			throw Error;
		} finally {
			setIsLoading(false);
		}
	};

	const accessibilityCategories = {
		mobility: ["Wheelchair User", "Balance/Coordination Difficulties", "Limited Mobility"],
		cognitive: [
			"Learning Disability",
			"Memory Impairment",
			"ADHD",
			"Processing Speed Difficulty",
		],
		hearing: ["Mild Hearing Loss", "Moderate Hearing Loss", "Severe Hearing Loss", "Deaf"],
		vision: ["Color Blindness", "Low Vision", "Blindness", "Night Blindness"],
		other: ["Sensory Sensitivities", "Neurodiversity", "Chronic Illness"],
	};

	return (
		<div className="container mx-auto px-4 py-8 max-w-2xl">
			<h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
				Your Profile
			</h1>

			{submitted && (
				<div
					className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative dark:bg-green-800 dark:border-green-700 dark:text-green-100"
					role="alert"
				>
					<strong className="font-bold">Success!</strong>
					<span className="block sm:inline">
						{" "}
						Your profile has been updated successfully.
					</span>
				</div>
			)}

			{needsOnboarding && (
				<div
					className="mb-6 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative dark:bg-yellow-800 dark:border-yellow-700 dark:text-yellow-100"
					role="alert"
				>
					<strong className="font-bold">Welcome!</strong>
					<span className="block sm:inline">
						{" "}
						Please complete your profile to continue.
					</span>
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="space-y-2">
					<label
						htmlFor="user_name"
						className="block text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						Username
					</label>
					<input
						type="text"
						id="user_name"
						name="user_name"
						required
						value={formData.user_name}
						onChange={handleInputChange}
						placeholder="Your username"
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					/>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						Email
					</label>
					<input
						type="email"
						id="email"
						name="email"
						value={formData.email}
						onChange={handleInputChange}
						placeholder="Your email address"
						required
						disabled
						className="w-full hover:cursor-not-allowed px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
					/>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="age"
						className="block text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						Age
					</label>
					<input
						type="number"
						id="age"
						name="age"
						value={formData.age}
						onChange={handleInputChange}
						placeholder="Your age"
						min="0"
						max="120"
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					/>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="gender"
						className="block text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						Gender
					</label>
					<input
						type="text"
						id="gender"
						name="gender"
						value={formData.gender}
						onChange={handleInputChange}
						placeholder="Your gender"
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					/>
				</div>

				<fieldset>
					<legend className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
						Accessibility Information
					</legend>
					{Object.entries(accessibilityCategories).map(([category, conditions]) => (
						<div key={category} className="mb-4">
							<h3 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300 capitalize">
								{category}
							</h3>
							<div className="space-y-2">
								{conditions.map((condition) => (
									<div key={condition} className="flex items-center">
										<input
											type="checkbox"
											id={condition.replace(/\s+/g, "-").toLowerCase()}
											checked={formData[category][condition]}
											onChange={() =>
												handleAccessibilityChange(category, condition)
											}
											className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
										/>
										<label
											htmlFor={condition.replace(/\s+/g, "-").toLowerCase()}
											className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
										>
											{condition}
										</label>
									</div>
								))}
							</div>
						</div>
					))}
				</fieldset>

				<div className="flex items-center">
					<input
						type="checkbox"
						id="lgbtq"
						name="LGBTQ"
						checked={formData.LGBTQ}
						onChange={handleInputChange}
						className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
					/>
					<label
						htmlFor="lgbtq"
						className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
					>
						LGBTQ+
					</label>
				</div>

				<button
					type="submit"
					disabled={isLoading}
					className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out dark:bg-orange-500 dark:hover:bg-orange-600 disabled:opacity-50"
				>
					{isLoading ? "Saving..." : "Update Profile"}
				</button>
			</form>
		</div>
	);
}
