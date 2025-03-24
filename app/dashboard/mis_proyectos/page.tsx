import React from "react";
import TitlePage from "@/app/components/TitlePage";
import { RoleProtectedRoute } from "@/app/components/RoleProtectedRoute";
import { ProjectView } from "@/app/components/projects/ProjectView";

const Page = () => { 
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

export default Page;