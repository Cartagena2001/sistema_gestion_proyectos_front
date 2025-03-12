import React from "react";
import { TemplateTable } from "@/app/components/DataTable";
import TitlePage from "@/app/components/TitlePage";
import { ModalAddProject } from "@/app/components/Modals/projects/AddProject";

export const page = () => {
  return (
    <div>
      <div className="flex align-center justify-between">
        <TitlePage
          title=" Gestion de tareas"
          span="En esta sección, puedes gestionar todas tus tareas. Utiliza la tabla a continuación para ver, editar y eliminar tareas existentes, o agregar nuevas tareas según sea necesario."
        />
        <ModalAddProject />
      </div>
      <div className="border p-5 rounded-4xl shadow-sm">
        <TemplateTable />
      </div>
    </div>
  );
};

export default page;
