import { env } from "@/env";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: env.VITE_SERVER_URL + "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Store queryClient reference for interceptor
let queryClientRef: any = null;

export const setQueryClient = (qc: any) => {
  queryClientRef = qc;
};

// Response interceptor - refetch permissions on 403
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403 && queryClientRef) {
      queryClientRef.invalidateQueries({ queryKey: ["user-permissions"] });
    }
    return Promise.reject(error);
  }
);

export { axiosInstance as apiClient };
