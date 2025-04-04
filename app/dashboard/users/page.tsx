import { ModalAddUser } from "@/app/components/Modals/users/AddUser";
import { TableUsers } from "@/app/components/Modals/users/TableUser";
import TitlePage from "@/app/components/TitlePage";
import React from "react";
import { RoleProtectedRoute } from '@/app/components/RoleProtectedRoute';

const Page = () => {
  return (
    <RoleProtectedRoute requiredPermission="users">
      <div>
        <div className="flex align-center justify-between">
          <TitlePage
            title="Gestión de usuarios"
            span="En esta sección, puedes gestionar todos tus usuarios. Utiliza la tabla a continuación para ver, editar y eliminar usuarios existentes, o agregar nuevos usuarios según sea necesario."
          />
          <ModalAddUser />
        </div>
        <div className="border p-5 rounded-4xl shadow-sm">
          <TableUsers />
        </div>
      </div>
    </RoleProtectedRoute>
  );
};

export default Page;
