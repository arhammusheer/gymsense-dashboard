import axios from "axios";
import { createContext, useContext, useState } from "react";

const API_BASE_URL = "https://gymsense-api-production.up.railway.app";

interface User {
  token: string;
  permissions: string[];
  email: string;
}

interface UserMethods {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
  checkAuth: () => boolean;
  hasPermission: (permission: string) => boolean;

  isAuthenticated: boolean;
  isLoading: boolean;
}

type IUserContext = User & UserMethods;

const api = axios.create({
  baseURL: API_BASE_URL,
});

const AuthContext = createContext<IUserContext>({} as IUserContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>({
    token: "",
    permissions: [],
    email: "",
  });

  const login = async (email: string, password: string) => {
    const { token, user } = await api
      .post("/user/login", { email, password })
      .then(
        (res: {
          data: {
            token: string;
            user: { permissions: string[]; email: string };
          };
        }) => res.data
      );
    const { permissions } = user;
    setUser({ email, token, permissions });
  };

  const logout = () => {
    setUser({ token: "", permissions: [], email: "" });
  };

  const register = async (email: string, password: string) => {
    const { token, user } = await api
      .post("/user/register", { email, password })
      .then(
        (res: {
          data: {
            token: string;
            user: { permissions: string[]; email: string };
          };
        }) => res.data
      );

    const { permissions } = user;
    const u = { email, token, permissions };
    setUser(u);
  };

  const checkAuth = () => {
    return !!user;
  };

  return (
    <AuthContext.Provider
      value={{
        ...user,
        login,
        logout,
        register,
        checkAuth,
        hasPermission: (permission: string) =>
          user.permissions.includes(permission),
        isAuthenticated: !!user.token,
        isLoading: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
