import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const axiosSecure = axios.create({
  baseURL: "https://club-sphere-server-new.vercel.app", 
});

const useAxiosSecure = () => {
  const navigate = useNavigate();

  useEffect(() => {
    axiosSecure.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers.authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Optional: Add a 401 response interceptor to logout users if token expires
    // axiosSecure.interceptors.response.use(
    //   (response) => response,
    //   async (error) => {
    //     if (error.response?.status === 401 || error.response?.status === 403) {
    //       // logout() logic here if needed
    //       navigate("/login");
    //     }
    //     return Promise.reject(error);
      //}
    //);
  }, [navigate]);

  return axiosSecure;
};

export default useAxiosSecure;