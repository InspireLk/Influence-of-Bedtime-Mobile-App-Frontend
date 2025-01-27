import axios from 'axios';

const axiosInstance = axios.create({ baseURL: process.env.EXPO_PUBLIC_API_URL });


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

export const endpoints = {

  auth: {
    sign_in: '/registration/admins/getadminbymail',
  },
  main: {
    get_node_list_for_admin: '/tree-main-hierarchy-nodes/getAttendanceForms',
    get_attendace_data: '/attendances/getAttendanceData', //'+lg_user_id+'/'+lg_user_table_id+'/'+user_code+'/'+node_mid+'/'+caller_user_id+'/'+caller_table_id
    mark_attendance: '/attendances/addQR'
  },
  
};