"use client";
import { useState,useEffect } from "react";
import { SessionProvider } from "next-auth/react"


export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) {
        return null; // Prevents hydration mismatch
    }
    
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}