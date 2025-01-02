import axios from "axios";
import { UserProfileFormData } from "./commons";
import { useAuth } from "react-oidc-context";



const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getAuthHeaders = () => {
	const auth = useAuth();
	return {
	  headers: {
		'Authorization': `Bearer ${auth.user?.access_token}`,
		'Content-Type': 'application/json'
	  }
	};
  };

  export const checkUserOnboarding = async (email: string) => {
	try {
	  const headers = getAuthHeaders();
	  const response = await axios.get(
		`${API_BASE_URL}/api/profile/${encodeURIComponent(email)}`,
		headers
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
export const getProfileByEmail = async (email: string, authToken?: string) => {
	try {
	  const headers = {
		'Authorization': authToken ? `Bearer ${authToken}` : '',
		'Content-Type': 'application/json'
	  };
  
	  const response = await axios.get(
		`${API_BASE_URL}/api/profile/${encodeURIComponent(email)}`,
		{ headers }
	  );
	  
	  if (!response.data) {
		return { exists: false, data: null };
	  }
	  return { exists: true, data: response.data };
	} catch (error) {
	  throw error;
	}
  };

/**
 * Updates a pre-existing user profile in the database
 * @param formData
 */
export const updateUserProfile = async (formData: UserProfileFormData, authToken?: string) => {
	try {
	  const headers = {
		'Authorization': authToken ? `Bearer ${authToken}` : '',
		'Content-Type': 'application/json'
	  };
  
	  const dataToSend = { ...formData, age: formData.age ? parseInt(formData.age, 10) : 0 };
	  const response = await axios.post(
		`${API_BASE_URL}/api/profile/update-profile`,
		dataToSend,
		{ headers }
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
export const createUserProfile = async (formData: UserProfileFormData, authToken?: string) => {
	try {
	  const headers = {
		'Authorization': authToken ? `Bearer ${authToken}` : '',
		'Content-Type': 'application/json'
	  };
  
	  const dataToSend = {
		...formData,
		age: formData.age ? parseInt(formData.age, 10) : 0,
	  };
  
	  const response = await axios.post(
		`${API_BASE_URL}/api/profile/create-profile`,
		dataToSend,
		{ headers }
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
