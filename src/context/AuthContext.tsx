import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import type { ReactNode } from "react";

type User = {
  username: string;
  rol: "ADMIN" | "CONSULTA";
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;

  // NUEVO: helper para fetch seguro
  authHeader: () => HeadersInit;

  // NUEVO: estado de carga de sesión
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // NUEVO: loading de sesión
  const [loading, setLoading] = useState(true);

  // ======================================================
  // RECUPERAR SESIÓN
  // ======================================================
  useEffect(() => {

    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);

  }, []);

  // ======================================================
  // LOGIN
  // ======================================================
  const login = async (username: string, password: string) => {

    try {

      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) return false;

      const data = await response.json();

      setToken(data.access_token);
      setUser(data.user);

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      return true;

    } catch {
      return false;
    }
  };

  // ======================================================
  // LOGOUT
  // ======================================================
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // ======================================================
  // HEADER CENTRALIZADO
  // ======================================================
  const authHeader = (): HeadersInit => {
    return token
      ? { Authorization: `Bearer ${token}` }
      : {};
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        authHeader,
        loading, // 👈 agregado
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ======================================================
// HOOK
// ======================================================
export function useAuth() {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}