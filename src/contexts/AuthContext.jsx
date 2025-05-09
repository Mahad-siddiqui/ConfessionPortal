import { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Axios instance for API calls
  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api", // Change this to your Flask backend URL
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Check if user is authenticated and if they're an admin
  const checkAuthState = useCallback(() => {
    setLoading(true);
    // Fetch user authentication state from Flask API
    axiosInstance
      .get("/check_auth")
      .then((response) => {
        if (response.data.user) {
          setCurrentUser(response.data.user);
          setIsAdmin(response.data.user.role === "admin");
        } else {
          setCurrentUser(null);
          setIsAdmin(false);
        }
      })
      .catch((error) => {
        console.error("Error checking auth state:", error);
        setIsAdmin(false);
        setCurrentUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Register a new user
  const register = async (email, password, displayName) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/register", {
        email,
        password,
        displayName,
      });
      setCurrentUser(response.data.user);
      toast.success("Account created successfully!");
      return response.data.user;
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Failed to create account");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/login", { email, password });
      setCurrentUser(response.data.user);
      toast.success("Login successful!");
      return response.data.user;
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Failed to log in");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const signOut = async () => {
    try {
      await axiosInstance.post("/logout");
      setCurrentUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Failed to log out");
      throw error;
    }
  };

  const value = {
    currentUser,
    isAdmin,
    loading,
    register,
    login,
    signOut,
    checkAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
