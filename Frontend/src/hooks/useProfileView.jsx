import axios from "axios";

const useProfileView = async (userId) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/profile/visit/${userId}`,
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    console.error("Error logging profile view:", error);
    throw error;
  }
};

export default useProfileView;
