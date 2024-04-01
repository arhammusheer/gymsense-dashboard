import axios, { AxiosError } from "axios";
import { createContext, useContext, useEffect, useState } from "react";

export const API_BASE_URL = "http://localhost:3000";

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
  error: string;

  saveState: () => void;
  loadState: () => void;
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
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setError("");
    setIsLoading(true);
    await api
      .post("/user/login", { email, password })
      .then(
        (res: {
          data: {
            token: string;
            user: { permissions: string[]; email: string };
          };
        }) => res.data
      )
      .then((data) => {
        setUser({
          email,
          token: data.token,
          permissions: data.user.permissions,
        });
        return data;
      })
      .then((d) =>
        saveState({ email, token: d.token, permissions: d.user.permissions })
      )
      .catch((err: AxiosError | Error) => {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data.message || err.message);
        } else {
          setError(err.message);
        }
        throw err;
      })
      .finally(() => setIsLoading(false));
  };

  const logout = () => {
    setUser({ token: "", permissions: [], email: "" });
    saveState();
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

  const saveState = (u: User = user) => {
    localStorage.setItem("user", JSON.stringify(u));
  };

  useEffect(() => {
    loadState();
  }, []);

  const loadState = () => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...user,
        login,
        error,
        logout,
        register,
        checkAuth,
        saveState,
        loadState,
        hasPermission: (permission: string) =>
          user.permissions.includes(permission),
        isAuthenticated: !!user.token,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
