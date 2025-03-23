"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { ModalAddUser } from "./AddUser";
import { User } from "./FormUser";

export function TableUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  async function fetchUsers() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("usuarios")
      .select(`
        id, 
        nombre_usuario, 
        email,
        roles (nombre).
        rol_id
      `)
      .neq('rol_id', 1)
      .returns<User[]>();

    if (error) {
      toast.error("Ocurrió un error al obtener los usuarios");
      return;
    }
    setUsers(data || []);
  }

  useEffect(() => {
    fetchUsers();
  }, [refreshKey]);

  async function handleUserDelete(userId: string) {
    const supabase = createClient();
    const { error } = await supabase.from("usuarios").delete().eq("id", userId);

    if (error) {
      toast.error("Ocurrió un error al eliminar el usuario");
      return;
    }
    toast.success("Usuario eliminado exitosamente");
    setUsers(users.filter((user) => user.id !== userId));
  }

  const handleRefresh = () => {
    fetchUsers();
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre de Usuario</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead className="text-right">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.nombre_usuario}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.roles?.nombre || "Sin rol"}</TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col gap-1">
                  <ModalAddUser
                    initialData={user}
                    onSubmitCallback={handleRefresh}
                  />
                  <Button
                    className="bg-red-500 cursor-pointer"
                    onClick={() => {
                      Swal.fire({
                        title: "¿Estás seguro?",
                        text: "No podrás revertir esto",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Sí, eliminarlo",
                        cancelButtonText: "Cancelar",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          if (user.id) {
                            handleUserDelete(user.id);
                          } else {
                            toast.error("ID de usuario no válido");
                          }
                        }
                      });
                    }}
                  >
                    <MdDelete /> Eliminar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedUser && (
        <ModalAddUser
          initialData={selectedUser}
          onSubmitCallback={() => {
            fetchUsers();
            setSelectedUser(null);
          }}
        />
      )}
    </>
  );
}
