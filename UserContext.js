// UserContext.js
import React, { createContext, useState, useEffect } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [lastLogin, setLastLogin] = useState(null);

  useEffect(() => {
    const checkIfSignedIn = async () => {
      try {
        const userInfo = GoogleSignin.getCurrentUser();
        if (userInfo) {
          setUser(userInfo);
          setLastLogin(Date.now());
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking sign-in status:", error);
      }
    };
    checkIfSignedIn();
  }, []);

  const login = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      console.log("User Info:", user);
      console.log("Profile picture url: ", user.data.user.photo);

      setUser(user);
      setLastLogin(Date.now());
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    setUser(null); // Clear user from context on logout
    setLastLogin(null);
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, lastLogin }}>
      {children}
    </UserContext.Provider>
  );
};
