import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

let isRefreshing = false;
let queue = [];

const processQueue = (error, token = null) => {
    queue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
    queue = [];
};

api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const original = err.config;
        if (err.response?.status === 401 && !original._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    queue.push({ resolve, reject });
                })
                    .then((token) => {
                        original.headers.Authorization = `Bearer ${token}`;
                        return api(original);
                    })
                    .catch(Promise.reject);
            }

            original._retry = true;
            isRefreshing = true;

            try {
                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
                    {},
                    { withCredentials: true }
                );
                useAuthStore.getState().setAuth(data.user, data.accessToken);
                processQueue(null, data.accessToken);
                original.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(original);
            } catch (e) {
                processQueue(e, null);
                useAuthStore.getState().logout();
                return Promise.reject(e);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(err);
    }
);

export default api;