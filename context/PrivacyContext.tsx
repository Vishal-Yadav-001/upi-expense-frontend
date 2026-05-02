"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface PrivacyContextType {
  isPrivacyEnabled: boolean;
  togglePrivacy: () => void;
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

export const PrivacyProvider = ({ children }: { children: ReactNode }) => {
  const [isPrivacyEnabled, setIsPrivacyEnabled] = useState(false);

  // Load from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("upi_privacy_enabled");
    if (saved !== null) {
      setIsPrivacyEnabled(saved === "true");
    }
  }, []);

  const togglePrivacy = () => {
    setIsPrivacyEnabled((prev) => {
      const next = !prev;
      localStorage.setItem("upi_privacy_enabled", String(next));
      return next;
    });
  };

  return (
    <PrivacyContext.Provider value={{ isPrivacyEnabled, togglePrivacy }}>
      {children}
    </PrivacyContext.Provider>
  );
};

export const usePrivacy = () => {
  const context = useContext(PrivacyContext);
  if (context === undefined) {
    throw new Error("usePrivacy must be used within a PrivacyProvider");
  }
  return context;
};
