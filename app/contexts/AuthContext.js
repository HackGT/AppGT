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
      // Nothing awaits this callback, so a throw here would otherwise become an
      // unhandled rejection and leave `loading` stuck at true forever.
      try {
        if (fUser) {
          setLoading(true);
          setFirebaseUser(fUser);
          const token = await fUser.getIdToken();
          const { status, json } = await getUserProfile(token, fUser.uid);
          // getUserProfile never throws; it returns error bodies. A real
          // profile always carries roles (users API merges them in), so
          // anything else must not reach App.js (user.roles.member).
          if (status !== 200 || !json?.roles) {
            throw new Error(
              `profile fetch failed: ${status} ${json?.type ?? ""} ${json?.message ?? ""}`
            );
          }
          setUser(json);
          setShowLogin(false);
        } else {
          setShowLogin(true);
        }
      } catch (error) {
        console.error("Failed to load the signed-in user's profile:", error);
        setShowLogin(true);
      } finally {
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
