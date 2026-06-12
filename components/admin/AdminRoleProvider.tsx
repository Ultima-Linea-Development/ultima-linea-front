"use client";

import { createContext, useContext } from "react";
import { useUserFromToken } from "@/lib/use-user-from-token";

const AdminRoleContext = createContext<string | null>(null);

type AdminRoleProviderProps = {
  initialRole: string | null;
  children: React.ReactNode;
};

export function AdminRoleProvider({ initialRole, children }: AdminRoleProviderProps) {
  const user = useUserFromToken();
  const role = user?.role ?? initialRole;

  return (
    <AdminRoleContext.Provider value={role}>{children}</AdminRoleContext.Provider>
  );
}

export function useAdminRole() {
  return useContext(AdminRoleContext);
}
