import { createContext, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import AuthState from "../Products/ProductsState";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = getAuth();

  // ------------ STATE -------------
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ------------ setAuthUser (same name) -------------
  const setAuthUser = (authUser) => {
    setUser(authUser);
  };

  // ------------ changeLoadingState (same name) -------------
  const changeLoadingState = () => {
    setLoading((prev) => !prev);
  };

  // ------------ login (same name) -------------
  const login = async (email, password) => {
    changeLoadingState();
    setError(false);
    setMessage("");

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      setUser(res.user);
    } catch (err) {
      setError(true);
      setMessage(err.message.split(": ")[1]);
    } finally {
      changeLoadingState();
    }
  };

  // ------------ signup (same name) -------------
  const signup = async ({ name, email, password }) => {
    changeLoadingState();
    setError(false);
    setMessage("");

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(auth.currentUser, {
        displayName: name,
      });

      setUser(res.user);
    } catch (err) {
      setError(true);
      setMessage(err.message.split(": ")[1]);
    } finally {
      changeLoadingState();
    }
  };

  // ------------ logout (same name) -------------
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setMessage("Signed out successfully!");
      setError(false);
    } catch (err) {
      setError(false);
      setMessage("");
    }
  };

  // ------------ clearError (same name) -------------
  const clearError = () => {
    setError(false);
    setMessage("");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        message,
        loading,

        login,
        signup,
        logout,
        clearError,
        setAuthUser,
        changeLoadingState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

