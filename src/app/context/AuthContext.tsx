"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AuthContextType = {
  email: string;
  setEmail: (email: string) => void;
  name: string;
  setName: (name: string) => void;
  username: string;
  setUsername: (username: string) => void;
  id: number | null;
  setId: (id: number | null) => void;
  address: string;
  setAddress: (address: string) => void;
  logout: () => void;
  logged: boolean;
  setLogged: (value: boolean) => void;
  loading: boolean;
  photoUrl: string;
  setPhotoUrl: (url: string) => void;
  role: string;
  token: string;
  setToken: (token: string) => void;
  saveToken: (token: string, rememberMe?: boolean) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [logged, setLogged] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [id, setId] = useState<number | null>(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [photoUrl, setPhotoUrl] = useState("");
  const [role, setRole] = useState("");
  
  const [token, setToken] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.logged) {
          setName(data.name ?? "");
          setUsername(data.username ?? "");
          setId(data.id);
          setEmail(data.email ?? "");
          setRole(data.role ?? "");
          setLogged(true);
         
        } else {
          const savedEmail = sessionStorage.getItem("register_email");
          if (savedEmail) setEmail(savedEmail);
        }
      })
      .catch(() => {
        const savedEmail = sessionStorage.getItem("register_email");
        if (savedEmail) setEmail(savedEmail);
      })
      .finally(() => setLoading(false));
  }, []);

  const saveToken = async (newToken: string, rememberMe = false) => {
    
    await fetch("/api/auth/set-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: newToken, rememberMe }),
    });
    
    setToken(newToken);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    sessionStorage.removeItem("register_email");
    setLogged(false);
    setName("");
    setUsername("");
    setId(null);
    setEmail("");
    setAddress("");
    setPhotoUrl("");
    setRole("");
    setToken("");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{
      email, setEmail,
      name, setName,
      username, setUsername,
      id, setId,
      address, setAddress,
      logout,
      logged, setLogged,
      loading,
      photoUrl, setPhotoUrl,
      role,
      token, setToken,
      saveToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}