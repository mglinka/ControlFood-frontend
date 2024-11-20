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

export const getAllProducts = async (page = 0, size = 15, searchQuery="") => {
    try {
        const response = await axiosInstance.get(`/products/withLabels?page=${page}&size=${size}&query=${encodeURI(searchQuery)}`);

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
export const getNutritionalValueNames = async () => {
    const response = await axiosInstance.get('/nutritional-value/names');
    return response.data;
}

export const getNutritionalValueGroups = async () => {
    const response = await axiosInstance.get('/nutritional-value/group-names');
    return response.data;
}

export const getProductByEan = async (ean: string) => {
    const response = await axiosInstance.get(`/products/by-ean/${ean}`);
    return response.data;


};
export const getAllergyProfileByAccountId = async (id: string) => {
    const response = await axiosInstance.get(`/allergy-profiles/byAccount/${id}`);
    return response.data;

};

export const getAllAllergens = async () => {
    const response = await axiosInstance.get("/allergens");
    return response.data;
};

export const changePassword = async (payload: { currentPassword: string; newPassword: string; confirmationPassword: string }) => {
    const response = await axiosInstance.post("/me/change-password", payload);
    return response.data;
};

export const getAccountInfo = async (id:string)=> {
    const response = await axiosInstance.get(`/account/${id}`);
    return response.data;
};

export const updateAccountInfo = async (payload:{firstName: string, lastName: string}) => {
    const response = await axiosInstance.put("/me/updateInfo", payload);
    return response.data;
};

export const getAllAccounts = async () => {
    const response  = await axiosInstance.get("/accounts");
    return response.data;
};

export const enableAccount = async (id: string) => {
    const response = await axiosInstance.put(`/account/enableAccount?id=${id}`);
    return response.data;
};


export const disableAccount = async (id:string) => {
    const response = await axiosInstance.put(`/account/disableAccount?id=${id}`);
    return response.data;
};

export const getRoles = async () => {
    const response = await axiosInstance.get("/roles");
    return response.data;
};

export const changeRole = async (accountId: string, roleId:string) => {
    return await axiosInstance.put(`/changeRole?accountId=${accountId}&roleId=${roleId}`);
};





