"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { createUserProfile, getProfileByEmail, updateUserProfile } from "@/lib/api";
import { redirect } from "next/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
	const { isAuthenticated, userAttributes, user } = useAuth();
	const [needsOnboarding, setNeedsOnboarding] = useState(true);
	const [formData, setFormData] = useState({
		email: userAttributes?.email || "",
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
			if (userAttributes?.email) {
				try {
					const result = await getProfileByEmail(userAttributes.email, user?.access_token);
					if (result == null) {
						setNeedsOnboarding(false);
					}
					if (result?.exists) {
						setFormData((prevData) => ({ ...prevData, ...result.data }));
						setNeedsOnboarding(false);
					} else {
						setNeedsOnboarding(true);
					}
				} catch (error) {
					console.error('Error fetching profile:', error);
				}
			}
		};
		getProfileByEmailFromServer();
	}, [userAttributes, user?.access_token]);

	if (!isAuthenticated) {
		redirect("/home");
	}

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
				await createUserProfile(formData, user?.access_token);
			} else {
				await updateUserProfile(formData, user?.access_token);
			}

			setSubmitted(true);
			setNeedsOnboarding(false);
		} catch (error) {
			console.error('Error saving profile:', error);
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
			<Card>
				<CardHeader>
					<CardTitle>Your Profile</CardTitle>
					<CardDescription>
						{needsOnboarding
							? "Please complete your profile to continue."
							: "Update your accessibility preferences"}
					</CardDescription>
				</CardHeader>

				<CardContent>
					{submitted && (
						<div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative dark:bg-green-800 dark:border-green-700 dark:text-green-100">
							<strong className="font-bold">Success!</strong>
							<span className="block sm:inline"> Your profile has been updated successfully.</span>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-2">
							<label htmlFor="user_name" className="block text-sm font-medium">
								Username
							</label>
							<input
								type="text"
								id="user_name"
								name="user_name"
								required
								value={formData.user_name}
								onChange={handleInputChange}
								className="w-full p-2 border rounded-md"
							/>
						</div>

						<div className="space-y-2">
							<label htmlFor="email" className="block text-sm font-medium">
								Email
							</label>
							<input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								disabled
								className="w-full p-2 border rounded-md bg-gray-100"
							/>
						</div>

						<div className="space-y-2">
							<label htmlFor="age" className="block text-sm font-medium">
								Age
							</label>
							<input
								type="number"
								id="age"
								name="age"
								value={formData.age}
								onChange={handleInputChange}
								min="0"
								max="120"
								className="w-full p-2 border rounded-md"
							/>
						</div>

						<div className="space-y-2">
							<label htmlFor="gender" className="block text-sm font-medium">
								Gender
							</label>
							<input
								type="text"
								id="gender"
								name="gender"
								value={formData.gender}
								onChange={handleInputChange}
								className="w-full p-2 border rounded-md"
							/>
						</div>

						<fieldset>
							<legend className="text-lg font-semibold mb-4">
								Accessibility Information
							</legend>
							{Object.entries(accessibilityCategories).map(([category, conditions]) => (
								<div key={category} className="mb-6">
									<h3 className="text-md font-medium mb-2 capitalize">
										{category}
									</h3>
									<div className="space-y-2">
										{conditions.map((condition) => (
											<div key={condition} className="flex items-center">
												<input
													type="checkbox"
													id={condition.replace(/\s+/g, "-").toLowerCase()}
													checked={formData[category][condition]}
													onChange={() => handleAccessibilityChange(category, condition)}
													className="h-4 w-4 text-blue-600 rounded"
												/>
												<label
													htmlFor={condition.replace(/\s+/g, "-").toLowerCase()}
													className="ml-2 block text-sm"
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
								className="h-4 w-4 text-blue-600 rounded"
							/>
							<label htmlFor="lgbtq" className="ml-2 block text-sm">
								LGBTQ+
							</label>
						</div>

						<Button
							type="submit"
							disabled={isLoading}
							className="w-full"
						>
							{isLoading ? "Saving..." : needsOnboarding ? "Create Profile" : "Update Profile"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}