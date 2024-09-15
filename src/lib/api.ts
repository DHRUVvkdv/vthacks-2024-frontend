import axios from "axios";

const API_BASE_URL = "https://rksm5pqdlaltlgj5pf6du4glwa0ahmao.lambda-url.us-east-1.on.aws";

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

export const saveUserProfile = async (formData: any) => {
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
