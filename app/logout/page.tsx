"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearAuth } from "@/lib/auth";
import Container from "@/components/layout/Container";
import Box from "@/components/layout/Box";
import Spinner from "@/components/ui/Spinner";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    clearAuth();
    document.cookie = "token=; path=/; max-age=0";
    router.push("/login");
  }, [router]);

  return (
    <Container>
      <Box display="flex" direction="col" gap="4" className="min-h-[60vh] items-center justify-center">
        <Spinner />
      </Box>
    </Container>
  );
}
