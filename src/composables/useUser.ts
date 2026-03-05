import { useQuery } from "@tanstack/vue-query";
import Cookies from "js-cookie";

import Api from "services/api";

export interface User {
    id: number;
    name: string;
    email: string;
}

export const useUser = () => {
    return useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const token = Cookies.get("token");

            const response = await Api.get("/api/users", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data.data as User[];
        }
    });
}
