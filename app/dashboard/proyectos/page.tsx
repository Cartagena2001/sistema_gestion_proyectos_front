import React from "react";
import TitlePage from "@/app/components/TitlePage";
import { ModalAddProject } from "@/app/components/Modals/projects/AddProject";
import { TableProjects } from "@/app/components/Modals/projects/TableProjects";
import { RoleProtectedRoute } from '@/app/components/RoleProtectedRoute';
import { ProjectView } from "@/app/components/projects/ProjectView";

export const page = () => {
  return (
    <RoleProtectedRoute requiredPermission="projects">
    <div>
      <div className="flex align-center justify-between">
        <TitlePage
          title="Gestion de proyectos"
          span="En esta sección, puedes gestionar todos tus proyectos. Utiliza la tabla a continuación para ver, editar y eliminar proyectos existentes, o agregar nuevos proyectos según sea necesario."
        />
        <ModalAddProject />
      </div>
      <div className="border p-5 rounded-4xl shadow-sm">
        <TableProjects />
      </div>
    </div>
    </RoleProtectedRoute>
  );
};

export default page;
