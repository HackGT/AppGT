import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const app = initializeApp({
  apiKey: "AIzaSyB6-uF9OFtITWqFMqrvNiPVmBODAZ_IBXk",
  authDomain: "auth.hexlabs.org",
});

initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
