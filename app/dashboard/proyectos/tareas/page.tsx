import React from "react";
import TitlePage from "@/app/components/TitlePage";
import { ModalAddTask } from "@/app/components/Modals/task/AddTask";
import { TableTasks } from "@/app/components/Modals/task/TableTask";
import { ModalAddTaskUser } from "@/app/components/Modals/task_users/AddTaskUser";
import { TableTaskUsers } from "@/app/components/Modals/task_users/TableTaskUser";

export const page = () => {
  return (
    <div>
      <div className="flex align-center justify-between">
        <TitlePage
          title=" Gestion de tareas"
          span="En esta sección, puedes gestionar todas tus tareas. Utiliza la tabla a continuación para ver, editar y eliminar tareas existentes, o agregar nuevas tareas según sea necesario."
        />
        <ModalAddTask />
      </div>
      <div className="border p-5 rounded-4xl shadow-sm">
        <TableTasks />
      </div>
      <div className="flex align-center justify-between mt-10">
        <TitlePage
          title=" Asigna tareas a los usuarios"
          span="En esta sección, puedes asignar tareas a los usuarios. Utiliza la tabla a continuación para ver, editar y eliminar asignaciones existentes, o agregar nuevas asignaciones según sea necesario."
        />
        <ModalAddTaskUser />
      </div>
      <div className="border p-5 rounded-4xl shadow-sm">
        <TableTaskUsers />
      </div>
    </div>
  );
};

export default page;
