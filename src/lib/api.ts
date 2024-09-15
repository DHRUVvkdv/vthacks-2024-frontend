import axios from "axios";

const API_BASE_URL = "https://rksm5pqdlaltlgj5pf6du4glwa0ahmao.lambda-url.us-east-1.on.aws/";

export interface UserProfileFormData {
	gender: "string";
	age: 0;
	email: "string";
	user_name: "string";
	mobility: object;
	cognitive: object;
	hearing: object;
	vision: object;
	LGBTQ: true;
	other: object;
}

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

		console.log("Profile saved successfully:", response.data);
		return response.data;
	} catch (error) {
		console.error("Error saving profile:", error);
		throw error;
	}
};
