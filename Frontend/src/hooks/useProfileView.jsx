import axios from "axios";
import api from "../utils/axiosClient.js";

const useProfileView = async (userId) => {
  try {
    const response = await api.get(
      `/profile/visit/${userId}`,
    );
    return response;
  } catch (error) {
    console.error("Error logging profile view:", error);
    throw error;
  }
};

export default useProfileView;
