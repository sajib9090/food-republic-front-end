/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import axiosInstance from "../Hooks/useApiRequest";
import { getApiRequest } from "../api/apiRequest";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [apiLoading, setApiLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user_id"));

        if (userData) {
          const res = await getApiRequest(`/api/v2/user/${userData}`);
          setUser(res.data);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setApiLoading(false);
      }
    };

    fetchData();
  }, []);

  const signInWithUsername = async (username, password) => {
    const response = await axios.post(
      `/api/v2/user/auth/login`,
      { username, password },
      { withCredentials: true }
    );
    console.log(response);
    localStorage.setItem("user_id", JSON.stringify(response?.data?.data?._id));
    setUser(response.data.data);
    setApiLoading(false);
    return response;
  };

  const logout = async () => {
    try {
      const response = await axiosInstance.post(
        `/api/v2/user/auth/logout`,
        null,
        { withCredentials: true }
      );

      if (response) {
        localStorage.removeItem("user_id");
        setUser(null);
        setApiLoading(false);
      }
    } catch (error) {
      setApiLoading(false);
    }
  };

  const authInfo = {
    signInWithUsername,
    user,
    setUser,
    logout,
    apiLoading,
    setApiLoading,
  };

  if (apiLoading) {
    return <div>Loading....</div>;
  }
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
