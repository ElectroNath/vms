import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { API_BASE_URL } from "../api"; // adjust this path if needed

// 1. Create the context
const UserDataContext = createContext();

// 2. Create the provider component
export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const cookieUser = Cookies.get("user");
        if (!cookieUser) {
          setLoading(false);
          return;
        }

        const parsedUser = JSON.parse(cookieUser);
        const res = await axios.get(
          `${API_BASE_URL}/auth/user/${parsedUser.staff_id}`
        );
        setUserData(res.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <UserDataContext.Provider value={{ userData, setUserData, loading }}>
      {children}
    </UserDataContext.Provider>
  );
};

// 3. Export hook to use context
export const useUserData = () => useContext(UserDataContext);
