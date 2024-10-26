// src/api.ts
import axios from './axiosConfig'; // Upewnij się, że ścieżka jest poprawna


export const registerUser = async (firstName: string, lastName: string, email: string, password: string) => {
    const response = await axios.post('/auth/register', {
        firstName,
        lastName,
        email,
        password,
    });
    return response.data;
};

export const loginUser = async (email: string, password: string) => {
    try {
        const response = await axios.post('/auth/authenticate', {
            email,
            password,
        });

        console.log('Odpowiedź serwera:', response.data);


        const token = response.data.token || response.data; // Upewnij się, że dostęp do tokenu jest poprawny
        if (token) {
            localStorage.setItem('token', token);
            console.log('Zalogowano pomyślnie, token:', token);
        } else {
            console.error('Token nie został zwrócony w odpowiedzi');
        }

        return response.data; // Zwracamy odpowiedź serwera
    } catch (error) {
        console.error('Błąd podczas logowania:', error);
        throw error;
    }


};

export const getAllProducts = async () => {
    const response = await axios.get('/products/withLabels');
    return response.data;
};
