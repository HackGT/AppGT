import React, { useMemo, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getUserProfile, getEvents } from "../api/api";

const AuthContext = React.createContext();

const AuthProvider = ({ app, children }) => {
  const auth = useMemo(() => getAuth(app), [app]);

  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
      if (fUser) {
        setLoading(true);
        console.log("FIRUser:", fUser);
        setFirebaseUser(fUser);
        const token = await fUser.getIdToken();
        const { status, json } = await getUserProfile(token, fUser.uid);
        setUser(json);
        setShowLogin(false);
        setLoading(false);
      } else {
        setShowLogin(true);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [auth]);

  const value = useMemo(
    () => ({
      firebaseUser: firebaseUser,
      loading: loading,
      showLogin: showLogin,
      user: user,
    }),
    [firebaseUser, loading, showLogin, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
