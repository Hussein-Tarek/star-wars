import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";

type AuthContextType = {
  token: string;
  login: (u: string, p: string) => void;
  logout: () => void;
};

const AuthCtx = createContext<AuthContextType>({
  token: "",
  login: () => {},
  logout: () => {},
});

const fakeToken = () => {
  const token = btoa(`token:${Date.now()}`);
  const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes
  return { token, expirationTime };
};

const fakeRefresh = () => {
  const token = btoa(`refreshed-token:${Date.now()}`);
  const expirationTime = Date.now() + 5 * 60 * 1000;
  return { token, expirationTime };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string>(() => {
    const storedToken = localStorage.getItem("token") || "";
    const storedExp = Number(localStorage.getItem("expiresAt"));
    if (storedToken && storedExp && Date.now() < storedExp) {
      return storedToken;
    }
    localStorage.removeItem("token");
    localStorage.removeItem("expiresAt");
    return "";
  });

  const [expiresAt, setExpiresAt] = useState<number | null>(() => {
    const storedExp = Number(localStorage.getItem("expiresAt"));
    return storedExp && storedExp > Date.now() ? storedExp : null;
  });

  useEffect(() => {
    if (!token || !expiresAt) return;

    const timeUntilRefresh = expiresAt - Date.now() - 5000; // 5 seconds before
    if (timeUntilRefresh <= 0) return;

    const timeoutId = setTimeout(() => {
      const { token: newToken, expirationTime } = fakeRefresh();
      setToken(newToken);
      setExpiresAt(expirationTime);
      localStorage.setItem("token", newToken);
      localStorage.setItem("expiresAt", expirationTime.toString());
    }, timeUntilRefresh);

    return () => clearTimeout(timeoutId);
  }, [token, expiresAt]);

  const login = useCallback((u: string, p: string) => {
    if (u === "admin" && p === "12345") {
      const { token: t, expirationTime } = fakeToken();
      setToken(t);
      setExpiresAt(expirationTime);
      localStorage.setItem("token", t);
      localStorage.setItem("expiresAt", expirationTime.toString());
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiresAt");
    setToken("");
    setExpiresAt(null);
  }, []);

  const contextValue = useMemo(
    () => ({ token, login, logout }),
    [token, login, logout]
  );

  return <AuthCtx.Provider value={contextValue}>{children}</AuthCtx.Provider>;
};

export const useAuth = () => useContext(AuthCtx);
