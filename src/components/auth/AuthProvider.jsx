// src/components/auth/AuthProvider.jsx

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../spinner";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserData(token)
        .then((userData) => {
          setUser(userData);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
          localStorage.removeItem("token");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get("https://kivulisafebackend-production.up.railway.app/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw new Error("Failed to fetch user data");
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post("https://kivulisafebackend-production.up.railway.app/login", {
        email,
        password,
      });
      const { token } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        const userData = await fetchUserData(token);
        setUser(userData);
      } else {
        throw new Error("Login failed: No token received");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  if (loading) {
    return <Spinner/>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
