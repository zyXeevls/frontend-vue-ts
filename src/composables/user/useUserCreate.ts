import { useMutation } from "@tanstack/vue-query";
import axios from "axios";
import Cookies from "js-cookie";

import Api from "services/api";

interface UserRequest
{
    name: string;
    email: string;
    password: string;
}

export const useUserCreate = () =>
{
    return useMutation({
        mutationFn: async (data: UserRequest) =>
        {
            const token = Cookies.get("token");

            const headers = token
                ? { Authorization: `Bearer ${token}` }
                : undefined;

            try {
                const response = await Api.post("/users", data, { headers });
                return response.data;
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 404) {
                    const fallbackResponse = await Api.post("/user/create", data, { headers });
                    return fallbackResponse.data;
                }
                throw error;
            }
        }
    });
};