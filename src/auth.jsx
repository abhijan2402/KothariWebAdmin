// src/auth.js
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

export const login = async (email, password) => {
  const res = await signInWithEmailAndPassword(auth, email, password);
  localStorage.setItem("adminToken", await res.user.getIdToken());
};

export const logout = async () => {
  await signOut(auth);
  localStorage.removeItem("adminToken");
};

export const isAuthenticated = async () => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem("adminToken", token);
        resolve(true);
      } else {
        localStorage.removeItem("adminToken");
        resolve(false);
      }
    });
  });
};
