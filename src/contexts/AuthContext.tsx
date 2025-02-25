
import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  name: string;
  type: "citizen" | "ngo";
  xp_points: number;
}

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    type: "citizen" | "ngo"
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for development
const mockUsers = [
  {
    id: "1",
    email: "citizen@example.com",
    password: "password",
    name: "John Doe",
    type: "citizen" as const,
    xp_points: 0
  },
  {
    id: "2",
    email: "ngo@example.com",
    password: "password",
    name: "Green Earth NGO",
    type: "ngo" as const,
    xp_points: 100
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const mockUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!mockUser) {
        throw new Error("Invalid credentials");
      }

      const { password: _, ...profile } = mockUser;
      setUser(profile);
      
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      
      navigate(`/${profile.type}/dashboard`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    type: "citizen" | "ngo"
  ) => {
    try {
      setLoading(true);
      // In a real app, this would be handled by a backend service
      const newUser = {
        id: Math.random().toString(),
        email,
        name,
        type,
        xp_points: 0
      };
      
      mockUsers.push({ ...newUser, password });
      setUser(newUser);
      
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully.",
      });
      
      navigate(`/${type}/dashboard`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Please try again later.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
