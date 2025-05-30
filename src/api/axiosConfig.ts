import axios from 'axios';
axios.defaults.headers.common['Content-Type'] = 'application/json';

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
    timeout: 60000,

});


axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log("Mam ", token)
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);



axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {

            console.warn('Unauthorized! Redirecting to login.');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
