import React from "react";
import TitlePage from "@/app/components/TitlePage";
import { ModalAddProject } from "@/app/components/Modals/projects/AddProject";
import { TableProjects } from "@/app/components/Modals/projects/TableProjects";
import { RoleProtectedRoute } from "@/app/components/RoleProtectedRoute";
import { ProjectView } from "@/app/components/projects/ProjectView";

export const page = () => {
  return (
    <RoleProtectedRoute requiredPermission="project_view">
      <div>
        <div className="flex align-center justify-between">
          <TitlePage
            title="Mis tareas y proyectos"
            span="Gestiona mis tareas y proyectos"
          />
        </div>
        <div>
          <ProjectView />
        </div>
      </div>
    </RoleProtectedRoute>
  );
};

export default page;
