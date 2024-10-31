import { jwtDecode } from 'jwt-decode';
import axiosInstance from "../api/axiosConfig.ts";



interface TokenPayload {
    id: string;
    email: string;
    role: string[];
    exp: number;
}


export const authService = {

    login(token: string) {
        console.log("Logging in with token:", token);
        try {
            localStorage.setItem('token', token);
            const decoded = this.decodeToken(token);
            if (decoded) {
                console.log("Logged in successfully. Token payload:", decoded);
            }
        } catch (error) {
            console.error("Error logging in:", error);
            throw new Error("Login failed");
        }
    },

    decodeToken(token: string): TokenPayload | null {
        try {
            const decoded = jwtDecode<any>(token); // Decode without strict typing first

            const tokenPayload: TokenPayload = {
                id: decoded.jti,
                email: decoded.sub,
                role: decoded.role,    // Directly use 'role'
                exp: decoded.exp       // Directly use 'exp'
            };

            return tokenPayload;
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    },

    isTokenExpired(token: string): { isExpired: boolean; decoded: TokenPayload | null } {
        const decoded = this.decodeToken(token);
        const isExpired = !decoded || decoded.exp * 1000 < Date.now();
        return { isExpired, decoded };
    },

    isLoggedIn(): boolean {
        const token = localStorage.getItem('token');
        if (!token) return false;
        const { isExpired } = this.isTokenExpired(token);
        return !isExpired;
    },
    async refreshToken() {
        try {
            const response = await axiosInstance.get('/auth/refresh-token', {});
            const newToken = response.data;
            localStorage.setItem('token', newToken);
            return newToken;
        } catch (error) {
            console.error("Error refreshing token:", error);
            throw new Error("Token refresh failed");
        }
    },

    getAccountId(): string | null {
        const token = localStorage.getItem('token');
        console.log("Marta", token)
        if (token) {
            const decoded = this.decodeToken(token);
            console.log(decoded)
            console.log(decoded?.exp)
            console.log(decoded?.email)
            console.log(decoded?.id)
            console.log(decoded?.role)
            return decoded ? decoded.id : null;

        }
        return null;
    },
    getAccountEmail(): string | null {
        const token = localStorage.getItem('token');
        console.log("Marta", token)
        if (token) {
            const decoded = this.decodeToken(token);

            return decoded ? decoded.email : null;

        }
        return null;
    }



};
