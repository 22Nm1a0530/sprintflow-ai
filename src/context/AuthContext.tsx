import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User } from "../types/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("sprintflow_user");
    const storedToken = localStorage.getItem("sprintflow_token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  function login(newUser: User, newToken: string) {
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem("sprintflow_user", JSON.stringify(newUser));
    localStorage.setItem("sprintflow_token", newToken);
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("sprintflow_user");
    localStorage.removeItem("sprintflow_token");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}