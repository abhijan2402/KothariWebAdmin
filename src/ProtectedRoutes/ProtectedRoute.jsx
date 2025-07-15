// src/ProtectedRoutes/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const ProtectedRoute = ({ children }) => {
  const [authState, setAuthState] = useState({ loading: true, isAuth: false });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthState({ loading: false, isAuth: !!user });
    });

    return () => unsubscribe();
  }, []);

  if (authState.loading) return <p>Loading...</p>;

  return authState.isAuth ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
