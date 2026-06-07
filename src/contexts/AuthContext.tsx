import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "citizen" | "police";

export interface User {
  name: string;
  email: string;
  role: UserRole;
  badgeId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  signup: (name: string, email: string, password: string, role: UserRole, badgeId?: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("traffic_user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("traffic_user", JSON.stringify(user));
    else localStorage.removeItem("traffic_user");
  }, [user]);

  const signup = (name: string, email: string, _password: string, role: UserRole, badgeId?: string) => {
    const newUser: User = {
      name,
      email,
      role,
      ...(role === "police" ? { badgeId: badgeId || `TCU-${1000 + Math.floor(Math.random() * 9000)}` } : {}),
    };
    setUser(newUser);
    return true;
  };

  const login = (email: string, _password: string, role: UserRole) => {
    const newUser: User = {
      name: role === "police" ? "Officer" : "Citizen",
      email,
      role,
      ...(role === "police" ? { badgeId: `TCU-${1000 + Math.floor(Math.random() * 9000)}` } : {}),
    };
    setUser(newUser);
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
