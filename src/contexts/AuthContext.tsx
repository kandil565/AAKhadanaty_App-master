import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export type UserRole = "user" | "serviceProvider" | "admin";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isAdmin?: boolean;
  providerProfileId?: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    phone: string,
    password: string,
    role?: UserRole,
    providerData?: { services: string[]; city: string; experience: number; bio: string }
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  loading: boolean;
  isUser: () => boolean;
  isProvider: () => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("a5adamaty_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const data = await response.json();
      const userData: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        role: data.user.role || (data.user.isAdmin ? "admin" : "user"),
        isAdmin: data.user.isAdmin || false,
        providerProfileId: data.user.providerProfileId || null,
      };

      setUser(userData);
      localStorage.setItem("a5adamaty_token", data.token);
      localStorage.setItem("a5adamaty_user", JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string,
    role: UserRole = "user",
    providerData?: { services: string[]; city: string; experience: number; bio: string }
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const body: Record<string, unknown> = {
        name,
        email: email.trim().toLowerCase(),
        phone,
        password,
        role,
        ...providerData,
      };

      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || "Registration failed" };
      }

      const userData: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        role: data.user.role || "user",
        isAdmin: data.user.isAdmin || false,
        providerProfileId: data.user.providerProfileId || null,
      };

      setUser(userData);
      localStorage.setItem("a5adamaty_token", data.token);
      localStorage.setItem("a5adamaty_user", JSON.stringify(userData));
      return { success: true };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Registration failed";
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("a5adamaty_token");
    localStorage.removeItem("a5adamaty_user");
  };

  const isUser = () => user?.role === "user";
  const isProvider = () => user?.role === "serviceProvider";
  const isAdmin = () => user?.role === "admin" || user?.isAdmin === true;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loading,
        isUser,
        isProvider,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
