import axios from "axios";
import { create } from "zustand";

const SERVER_URL = "http://localhost:5000";
const API_URL = "/api/auth";
axios.defaults.withCredentials = true;
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  errorr: null,
  isLoading: false,
  isCheckingAuth: true,

  signup: async (email, password, name) => {
    set({ isLoading: true, errorr: null });
    try {
      const response = await axios.post(`${SERVER_URL}${API_URL}/signup`, {
        email,
        password,
        name,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      set({
        errorr: err.response.data.message || "Error signing up",
        isLoading: false,
      });
      throw err;
    }
  },
  verifyEmail: async (code) => {
    set({ isLoading: true, errorr: null });
    try {
      const response = await axios.post(
        `${SERVER_URL}${API_URL}/verify-email`,
        { code }
      );
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        errorr: error.response.data.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },
  login: async (email, password) => {
    set({ isLoading: true, errorr: null });
    try {
      const response = await axios.post(`${SERVER_URL}${API_URL}/login`, {
        email,
        password,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        errorr: null,
        isLoading: false,
      });
    } catch (err) {
      set({
        errorr: err.response.data.message || "Error signing up",
        isLoading: false,
      });
      throw err;
    }
  },
  checkAuth: async () => {
    await new Promise((resolve) => setTimeout(resolve,1000))
    set({ isCheckingAuth: true, errorr: null });
    try {
      const response = await axios.get(`${SERVER_URL}${API_URL}/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
        await axios.post(`${SERVER_URL}${API_URL}/logout`);
        set({ user: null, isAuthenticated: false, error: null, isLoading: false });
    } catch (error) {
        set({ error: "Error logging out", isLoading: false });
        throw error;
    }
},
forgotPassword: async (email) => {
    set({ isLoading: true, errorr: null });
    try {
        const response = await axios.post(`${SERVER_URL}${API_URL}/forgot-password`, { email });
        set({ message: response.data.message, isLoading: false });
    } catch (error) {
        set({
            isLoading: false,
            errorr: error.response.data.message || "Error sending reset password email",
        });
        throw error;
    }
},
resetPassword: async (token, password) => {
    set({ isLoading: true, errorr: null });
    try {
        const response = await axios.post(`${SERVER_URL}${API_URL}/reset-password/${token}`, { password });
        set({ message: response.data.message, isLoading: false });
    } catch (error) {
        set({
            isLoading: false,
            errorr: error.response.data.message || "Error resetting password",
        });
        throw error;
    }
},
}));
