import { type ReactNode, createContext, useContext, useState, useEffect, useMemo } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { getUserProfile } from '@/api/api';

const LOGIN_URL = 'https://login.hexlabs.org';
const AUTH_URL = 'https://auth.api.hexlabs.org';
const FIREBASE_API_KEY = 'AIzaSyB6-uF9OFtITWqFMqrvNiPVmBODAZ_IBXk';
const FIREBASE_SIGN_IN_URL =
  `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${FIREBASE_API_KEY}`;

// Module-level storage (replaces AsyncStorage)
const storage: Record<string, string> = {};
const memoryStorage = {
  getItem: (key: string): Promise<string | null> =>
    Promise.resolve(storage[key] ?? null),
  setItem: (key: string, value: string): Promise<void> => {
    storage[key] = value;
    return Promise.resolve();
  },
  removeItem: (key: string): Promise<void> => {
    delete storage[key];
    return Promise.resolve();
  },
};

// Module-level token store
let _storedToken: string | null = null;
let _storedUid: string | null = null;

export interface FirebaseUser {
  uid: string;
  getIdToken: () => Promise<string>;
}

export interface UserProfile {
  name: { first: string; middle: string; last: string };
  email: string;
  phoneNumber: string;
  roles: { member: boolean };
}

export interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isAuthenticating: boolean;
  showLogin: boolean;
  user: UserProfile | null;
  signOut: () => Promise<void>;
}

/** Decode the `sub` claim from a Firebase ID token (JWT) without verifying it.
 *  Verification happens server-side; we just need the UID to build the profile URL. */
function decodeJwtUid(token: string): string {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.sub || decoded.uid || 'unknown';
  } catch {
    return 'unknown';
  }
}

const AuthContext = createContext<AuthContextValue>({
  firebaseUser: null,
  loading: true,
  isAuthenticating: false,
  showLogin: true,
  user: null,
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  // On mount, check if we have a stored session
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await memoryStorage.getItem('authToken');
        const uid = await memoryStorage.getItem('authUid');
        if (token && uid) {
          const fUser: FirebaseUser = {
            uid,
            getIdToken: async () => token,
          };
          const { status, json } = await getUserProfile(token, uid);
          if (status === 200 && json?.roles) {
            setFirebaseUser(fUser);
            setUser(json);
            setShowLogin(false);
          } else {
            await memoryStorage.removeItem('authToken');
            await memoryStorage.removeItem('authUid');
            setShowLogin(true);
          }
        } else {
          setShowLogin(true);
        }
      } catch (e) {
        console.warn('Session restore failed:', e);
        setShowLogin(true);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async () => {
    try {
      const redirectUrl = Linking.createURL('redirect');
      const browserUrl = `${LOGIN_URL}/?redirect=${encodeURIComponent(redirectUrl)}`;

      // Set before opening browser so the /redirect deep link sees it immediately
      setIsAuthenticating(true);

      const result = await WebBrowser.openAuthSessionAsync(browserUrl, redirectUrl, {
        preferEphemeralSession: true,
      });

      if (result.type === 'success') {
        const url = result.url;
        const splitUrl = url.split('?');
        if (splitUrl[1]) {
          const params = splitUrl[1].split('&');
          const codeParam = params.find((p) => p.startsWith('idToken'));
          if (codeParam) {
            const idToken = codeParam.split('=')[1];
            await fetchAccessToken(idToken);
            return;
          }
        }
      }
      // Browser was dismissed or failed without a token
      setIsAuthenticating(false);
    } catch (error) {
      console.log('Login error:', error);
      setIsAuthenticating(false);
    }
  };

  const fetchAccessToken = async (idToken: string) => {
    try {
      // Step 1: exchange HexLabs idToken → Firebase customToken
      const response = await fetch(`${AUTH_URL}/auth/status/`, {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + idToken },
      });
      const authJson = await response.json();

      const customToken: string | undefined = authJson.customToken || authJson.token;
      if (!customToken) {
        console.error('Auth status did not return a customToken:', authJson);
        return;
      }

      // Step 2: exchange Firebase customToken → Firebase ID token via REST API
      // (replaces signInWithCustomToken from the Firebase JS SDK)
      const firebaseRes = await fetch(FIREBASE_SIGN_IN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: customToken, returnSecureToken: true }),
      });
      const firebaseJson = await firebaseRes.json();

      if (!firebaseJson.idToken) {
        console.error('Firebase sign-in did not return an idToken:', firebaseJson);
        return;
      }

      const token: string = firebaseJson.idToken;
      const uid: string = decodeJwtUid(token);

      const fUser: FirebaseUser = {
        uid,
        getIdToken: async () => token,
      };

      const { status, json } = await getUserProfile(token, uid);
      if (status === 200 && json?.roles) {
        await memoryStorage.setItem('authToken', token);
        await memoryStorage.setItem('authUid', uid);
        setFirebaseUser(fUser);
        setUser(json);
        setShowLogin(false);
      } else {
        console.error('Profile fetch failed after login:', status, json);
        setShowLogin(true);
      }
    } catch (error) {
      console.error('fetchAccessToken failed:', error);
      setShowLogin(true);
    } finally {
      setIsAuthenticating(false);
      setLoading(false);
    }
  };

  const signOut = async () => {
    await memoryStorage.removeItem('authToken');
    await memoryStorage.removeItem('authUid');
    setFirebaseUser(null);
    setUser(null);
    setShowLogin(true);
  };

  const value = useMemo(
    () => ({ firebaseUser, loading, isAuthenticating, showLogin, user, signOut, login }),
    [firebaseUser, loading, isAuthenticating, showLogin, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Also export login separately so LoginOnboarding can call it
export { AuthContext };
export const useAuthLogin = () => {
  const ctx = useContext(AuthContext) as any;
  return ctx.login as () => Promise<void>;
};
