"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { useRouter, usePathname } from "next/navigation";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "VENDOR" | "CUSTOMER";
  store?: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  refetchUser: () => Promise<void>;
  setUser: Dispatch<SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/login", {
        credentials: "include",
      });

      if (!res.ok) {
        setUser(null);

        // 🔴 لو مش في صفحة login → اعملي redirect
        if (pathname !== "/login") {
          router.replace("/login");
        }else{
          router.replace("/Home");
        }
        return;
      }

      const data = await res.json();
      setUser(data.user ?? null);
    } catch  {
      setUser(null);
      if (pathname !== "/login") {
        router.replace("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        refetchUser: fetchUser,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
