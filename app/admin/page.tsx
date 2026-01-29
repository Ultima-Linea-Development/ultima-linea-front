"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/layout/Container";
import Box from "@/components/layout/Box";
import Spinner from "@/components/ui/Spinner";
import { isAdmin, getUserFromToken, clearAuth } from "@/lib/auth";
import Dashboard from "@/components/admin/Dashboard";

export default function AdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const user = getUserFromToken();
      
      if (!user || !isAdmin()) {
        clearAuth();
        router.push("/login?redirect=/admin");
        return;
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <Container>
        <Box display="flex" direction="col" gap="4" className="min-h-[60vh] items-center justify-center">
          <Spinner />
        </Box>
      </Container>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <Dashboard />;
}
