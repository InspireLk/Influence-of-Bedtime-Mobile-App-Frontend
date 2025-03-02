import axios from 'axios';

const axiosInstance = axios.create({ baseURL: process.env.EXPO_PUBLIC_API_URL });

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    console.log('Error Response:', error);
    Promise.reject((error.response && error.response.data) || 'Something went wrong')
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

export const endpoints = {

  auth: {
    sign_in: '/api/auth/sign_in',
    sign_up: '/api/auth/sign_up',
  },
  
};