"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { api } from "@/lib/api";
import { Alert, Notification, User } from "@/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: { phone: string; password: string }) => Promise<void>;
  register: (formData: any) => Promise<void>;
  logout: () => Promise<void>;
  update: (formData: any) => Promise<void>;
  uploadImage: (file: File) => Promise<string | null>;
  notifications: Notification[];
  alerts: Alert[];
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteAlert: (id: number) => Promise<void>;
  loadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const tokenKey = "patient_token";
const publicPaths = ["/auth/login", "/auth/register"];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const setToken = (token: string) => {
    localStorage.setItem(tokenKey, token);
    Cookies.set(tokenKey, token);
  };

  const clearToken = () => {
    localStorage.removeItem(tokenKey);
    Cookies.remove(tokenKey);
  };

  const loadUser = async () => {
    const token = localStorage.getItem(tokenKey);
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get("/me");
      setUser(data);
    } catch {
      clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: { phone: string; password: string }) => {
    const { data } = await api.post("/login", credentials);
    setToken(data.token);
    await loadUser();
    queryClient.invalidateQueries({ queryKey: ["alerts"] });
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const register = async (formData: any) => {
    const { data } = await api.post("/register", formData);
    setToken(data.token);
    await loadUser();
    queryClient.invalidateQueries({ queryKey: ["alerts"] });
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {}
    clearToken();
    setUser(null);
    router.push("/auth/login");
  };

  const markAsRead = async (id: number) => {
    await api.post(`/alerts/${id}/read`);
    queryClient.invalidateQueries({ queryKey: ["alerts"] });
  };

  const markAllAsRead = async () => {
    await api.post("/alerts/read-all");
    queryClient.invalidateQueries({ queryKey: ["alerts"] });
  };

  const deleteAlert = async (id: number) => {
    await api.delete(`/alerts/${id}`);
    queryClient.invalidateQueries({ queryKey: ["alerts"] });
  };

  const update = async (formData: any) => {
    const { data } = await api.put("/update", formData);
    setUser(data.user);
  };

  // auth-context.tsx
  const uploadImage = async (file: File) => {
    const fd = new FormData();
    fd.append("image", file); // name MUST be "image"

    const { data } = await api.post("/upload-image", fd); // ← no headers override
    setUser((prev) => (prev ? { ...prev, image: data.image_url } : prev));
    return data.image_url as string;
  };

  // 🧠 React Query fetch for alerts
  const { data: alerts = [] } = useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      const { data } = await api.get("/alerts");
      return data;
    },
    enabled: !!user, // only fetch when authenticated
  });

  // 🧠 React Query fetch for notifications
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await api.get("/notifications");
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (!loading && !user && !publicPaths.includes(pathname)) {
      router.push("/auth/login");
    }
  }, [loading, user, pathname]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        update,
        uploadImage,
        notifications,
        alerts,
        markAsRead,
        loadUser,
        markAllAsRead,
        deleteAlert,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
