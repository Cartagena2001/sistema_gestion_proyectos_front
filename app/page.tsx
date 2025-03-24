"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginClient } from "./components/LoginClient";
import { isAuthenticated } from "./services/auth.service";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return null;
  }

  return <LoginClient />;
}