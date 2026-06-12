"use client";

import { useEffect, useState } from "react";
import { getUserFromToken } from "@/lib/auth";

export function useUserFromToken() {
  const [user, setUser] = useState<ReturnType<typeof getUserFromToken>>(null);

  useEffect(() => {
    setUser(getUserFromToken());
  }, []);

  return user;
}
