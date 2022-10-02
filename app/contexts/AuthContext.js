import React, { useMemo, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { firebase } from "@react-native-firebase/messaging";

const AuthContext = React.createContext();

const USERS_URL = "https://users.api.hexlabs.org";

const AuthProvider = ({ app, children }) => {
  const auth = useMemo(() => getAuth(app), [app]);

  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState(null);

  const fetchUserProfile = async () => {
    const json = await fetchProfile(firebaseUser.uid);
    setUser(json);
  };

  const fetchProfile = async (uid) => {
    const token = await firebaseUser.getIdToken();
    const response = await fetch(`${USERS_URL + "/users/" + uid}/`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const json = await response.json();
    return json;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
      if (fUser) {
        setLoading(true);
        console.log("FIRUser:", fUser);
        setFirebaseUser(fUser);
        await fetchUserProfile(fUser);
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
      fetchProfile: fetchProfile
    }),
    [firebaseUser, loading, showLogin, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
