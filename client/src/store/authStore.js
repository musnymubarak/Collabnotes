import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    user: null,
    accessToken: null,
    setAuth: (user, accessToken) => set({ user, accessToken }),
    setToken: (accessToken) => set({ accessToken }),
    logout: () => set({ user: null, accessToken: null }),
}));