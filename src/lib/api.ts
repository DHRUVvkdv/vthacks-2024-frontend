import axios from "axios";
import { UserProfileFormData } from "./commons";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const checkUserOnboarding = async (email: string) => {
	try {
		const response = await axios.get(
			`${API_BASE_URL}/api/profile/${encodeURIComponent(email)}`
		);
		return { exists: true, data: response.data };
	} catch (error) {
		return { exists: false, data: null };
	}
};

/**
 * Gets the user profile based on the unique email identifier for the user
 * @param email to find the user by
 * @returns
 */
export const getProfileByEmail = async (email: string) => {
	try {
		const response = await axios.get(
			`${API_BASE_URL}/api/profile/${encodeURIComponent(email)}`
		);
		if (!response.data) {
			return { exists: false, data: null };
		} else {
			return { exists: true, data: response.data };
		}
	} catch (error) {
		throw error;
	}
};

/**
 * Updates a pre-existing user profile in the database
 * @param formData
 */
export const updateUserProfile = async (formData: UserProfileFormData) => {
	try {
		const dataToSend = { ...formData, age: formData.age ? parseInt(formData.age, 10) : 0 };
		const response = await axios.post(
			`${API_BASE_URL}/api/profile/update-profile`,
			dataToSend,
			{ headers: { "Content-Type": "application/json" } }
		);
		return response.data;
	} catch (error) {
		throw error;
	}
};

/**
 * Creates a pre-existing user profile in the database
 * @param formData
 */
export const createUserProfile = async (formData: UserProfileFormData) => {
	console.log(formData);
	try {
		const dataToSend = {
			...formData,
			age: formData.age ? parseInt(formData.age, 10) : 0,
		};

		const response = await axios.post(
			`${API_BASE_URL}/api/profile/create-profile`,
			dataToSend,
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		return response.data;
	} catch (error) {
		throw error;
	}
};
export const giveGPTPromptToBackend = async (email: string, prompt: string) => {
	console.log(email, prompt);
	try {
		const response = await axios.post(
			`${API_BASE_URL}/api/plan/comprehensive-plan/${encodeURIComponent(email)}`,
			null, // empty body
			{
				params: {
					user_input: prompt,
				},
			}
		);
		return response.data;
	} catch (err) {
		console.error("Error in giveGPTPromptToBackend:", err);
		throw err;
	}
};
