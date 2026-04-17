import api from "./axiosClient.js";

export const getStatus = async (targetUserId) => {
  try {
    const status = await api.get(`/status/${targetUserId}`);
    return status;
  } catch (error) {
    console.log(error);
  }
};
