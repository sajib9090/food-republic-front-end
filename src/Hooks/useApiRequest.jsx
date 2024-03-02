/* eslint-disable no-unused-vars */
// api.js
import axios from "axios";

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        await refreshAccessToken();
        const retryResponse = await axios.request(error.config);
        return retryResponse;
      } catch (refreshError) {
        handleTokenRefreshError();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

const refreshAccessToken = async () => {
  try {
    const refreshTokenResponse = await axios.get(
      `/api/v2/user/auth/refresh-token`,
      { withCredentials: true }
    );
    return refreshTokenResponse;
  } catch (error) {
    // Handle error during token refresh
    console.error("Error refreshing access token:", error);
    throw error;
  }
};

const handleTokenRefreshError = () => {
  localStorage.removeItem("user_id");
};

export default axiosInstance;
