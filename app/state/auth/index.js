import React, { useState, useEffect } from "react";
import { initialValue, authReducer } from "./AuthReducer";
import {} from "./AuthActionTypes";
import { AuthContext } from "../context";
import { onAuthStateChanged } from "firebase/auth";
import { app } from "../../../firebase";
import { getAuth } from "firebase/auth";

export default function AuthProvider({ children }) {
  const auth = getAuth(app);

  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState(null);

  const usersUrl = "https://users.api.hexlabs.org";

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (fUser) => {
      if (fUser) {
        setLoading(true);
        console.log("FIRUser:", fUser);
        await fetchUserDetails(fUser);
        setShowLogin(false);
        setLoading(false);
        setFirebaseUser(fUser);
      } else {
        setShowLogin(true);
        setLoading(false);
      }
    });
    return unsubAuth;
  }, []);

  const fetchUserDetails = async (fUser) => {
    const token = await fUser.getIdToken();
    const response = await fetch(`${usersUrl + "/users/" + fUser.uid}/`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const json = await response.json();
    console.log("userJson: ", json);
    setUser(json);
  };

  const value = {
    firebaseUser: firebaseUser,
    loading: loading,
    showLogin: showLogin,
    user: user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
