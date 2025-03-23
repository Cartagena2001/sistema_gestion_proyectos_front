"use client";
import React, { useEffect } from "react";
import { CharHome } from "../components/charts/Chart";
import TitlePage from "../components/TitlePage";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = React.useState<any>(null);

  useEffect(() => {
    // Check for token and user data
    const token = document.cookie.includes('token');
    const storedUserData = localStorage.getItem('userData');

    if (!token || !storedUserData) {
      router.push('/');
      return;
    }

    setUserData(JSON.parse(storedUserData));
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>Hola Bienvenido: <span className="font-bold">{userData.email}</span></p>
      <TitlePage
        title="Dashboard"
        span="En esta sección, puedes ver los datos de tu empresa en gráficos."
      />
      <CharHome />
    </div>
  );
}
