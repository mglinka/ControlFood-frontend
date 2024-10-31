
import axiosInstance from "./axiosConfig.ts";


export const registerUser = async (firstName: string, lastName: string, email: string, password: string) => {
    const response = await axiosInstance.post('/auth/register', {
        firstName,
        lastName,
        email,
        password,
    });
    return response.data;
};

export const loginUser = async (email?: string , password?: string ) => {
    try {
        const response = await axiosInstance.post('/auth/authenticate', {
            email,
            password,
        });


        console.log('Odpowiedź serwera:', response.data);


        const token = response.data.token || response.data;
        if (token) {
            localStorage.setItem('token', token);
            console.log('Zalogowano pomyślnie, token:', token);
        } else {
            console.error('Token nie został zwrócony w odpowiedzi');
        }

        return response.data;
    } catch (error) {
        console.error('Błąd podczas logowania:', error);
        throw error;
    }


};

export const getAllProducts = async (page = 0, size = 15) => {
    try {
        const response = await axiosInstance.get(`/products/withLabels?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching products with pagination:", error);
        throw new Error("Failed to fetch products");
    }
};


export const getAllUnits = async () =>{
    const response = await axiosInstance.get('/units');
    return response.data;
}

export const getProductByEan = async (ean: string) => {
    const response = await axiosInstance.get(`/products/by-ean/${ean}`);
    return response.data;
};