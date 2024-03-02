import axiosInstance from "../Hooks/useApiRequest";

const postApiRequest = async (url, data = {}) => {
  try {
    const response = await axiosInstance.post(url, data, {
      withCredentials: true,
    });
    return response?.data;
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

const patchApiRequest = async (url, data) => {
  try {
    const response = await axiosInstance.patch(url, data, {
      withCredentials: true,
    });
    return response?.data;
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

const getApiRequest = async (url) => {
  try {
    const response = await axiosInstance.get(url, {
      withCredentials: true,
    });
    return response?.data;
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

const deleteApiRequest = async (url) => {
  try {
    const response = await axiosInstance.delete(url, {
      withCredentials: true,
    });
    return response?.data;
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

export { postApiRequest, getApiRequest, patchApiRequest, deleteApiRequest };
