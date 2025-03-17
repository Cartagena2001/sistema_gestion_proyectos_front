import React from "react";
import { CharHome } from "../components/charts/Chart";
import TitlePage from "../components/TitlePage";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export const page = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/");
  }
  return (
    <div>
      <p>Hola Bienvenido: <span className="font-bold">{data.user.email}</span> </p>
      <TitlePage
        title="Dashboard"
        span="En esta sección, puedes ver los datos de tu empresa en gráficos."
      />
      <CharHome />
    </div>
  );
};

export default page;
