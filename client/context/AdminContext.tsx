import React, { createContext, useContext, useState, PropsWithChildren } from 'react';

interface AdminContextType {
  adminOpen: boolean;
  setAdminOpen: (open: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: PropsWithChildren) {
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <AdminContext.Provider value={{ adminOpen, setAdminOpen }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return ctx;
}
