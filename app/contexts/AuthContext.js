import React, { useMemo, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";

const AuthContext = React.createContext();

const USERS_URL = "https://users.api.hexlabs.org";

const AuthProvider = ({ app, children }) => {
  const auth = useMemo(() => getAuth(app), [app]);

  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState(null);

  const fetchUserDetails = async (fUser) => {
    const token = await fUser.getIdToken();
    const response = await fetch(`${USERS_URL + "/users/" + fUser.uid}/`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const json = await response.json();
    console.log("userJson: ", json);
    setUser(json);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
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
