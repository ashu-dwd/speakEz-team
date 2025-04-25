// client/src/context/authContext.js
import { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase"; // Adjust path if needed

const AuthContext = createContext();
const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

/*  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else{
      console.log("No stored user found");
      setUser(null);
    }
  }, []);*/
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        localStorage.setItem("user", JSON.stringify(firebaseUser));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    });
  
    return () => unsubscribe();
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.setItem("authState", "false");
  };
   const login = (userData, token) => {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      localStorage.setItem("authState", "true");
    };
  
    return (
    <AuthContext.Provider value={{ user, setUser, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
