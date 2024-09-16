import axios from 'axios';

import { BED_TIME_SERVER_URL } from '@env';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: BED_TIME_SERVER_URL });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/api/auth/me',
    login: '/api/auth/login',
    register: '/api/auth/register',
    refresh_token: '/api/auth/refresh_token',
  },
  user: {
    update_account: '/api/user/update_account',
    update_password: '/api/user/update_password',
    get_users_for_admin: 'api/user/get-all-users-to-admin',
    update_user: '/api/user/update_user',
    get_staff_for_admin: 'api/user/get-all-staff-for-admin',
  },
};
