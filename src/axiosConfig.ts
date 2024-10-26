// src/axiosConfig.ts
import axios from 'axios';

// Tworzymy instancję axios z domyślną konfiguracją
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api/v1', // Podstawowy URL twojego API
    timeout: 5000, // Czas oczekiwania na odpowiedź w milisekundach
    headers: {
        'Content-Type': 'application/json', // Domyślny typ treści
        // Możesz dodać inne nagłówki, np. dla autoryzacji
        // 'Authorization': `Bearer ${token}`,
    },
});

// Możesz dodać interceptory, jeśli potrzebujesz
axiosInstance.interceptors.request.use(
    (config) => {
        // Możesz tu dodać logikę przed wysłaniem żądania
        // np. dodanie tokenu autoryzacyjnego
        // const token = localStorage.getItem('token');
        // if (token) {
        //     config.headers['Authorization'] = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        // Obsługa błędów przed wysłaniem żądania
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        // Możesz tu dodać logikę po otrzymaniu odpowiedzi
        return response;
    },
    (error) => {
        // Obsługa błędów odpowiedzi
        return Promise.reject(error);
    }
);

export default axiosInstance;
