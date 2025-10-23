// Handles user login by sending credentials to the auth API
export const loginUser = async (credentials) => {
  const API_ENDPOINT = `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`;
  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    // Throw error if response is not OK
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    // Parse raw response to handle potential non-JSON responses
    const rawResponse = await response.text();
    return JSON.parse(rawResponse);
  } catch (error) {
    throw error;
  }
};
