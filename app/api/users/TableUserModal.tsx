"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { ModalAddUser } from "./AddUser";  // Aquí cambiamos de AddTask a AddUser
import { User } from "./FormUser";  // Aquí cambiamos de Task a User

export function TableUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  async function fetchUsers() {
    const supabase = createClient();
    const { data, error } = await supabase.from("users").select("*");

    if (error) {
      toast.error("Ocurrió un error al obtener los usuarios");
      return;
    }
    setUsers(data || []);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleUserDelete(userId: string) {
    const supabase = createClient();
    const { error } = await supabase.from("users").delete().eq("id", userId);

    if (error) {
      toast.error("Ocurrió un error al eliminar el usuario");
      return;
    }
    toast.success("Usuario eliminado exitosamente");
    setUsers(users.filter((user) => user.id !== userId));
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Nombre de Usuario</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead className="text-right">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.nombre}</TableCell>
              <TableCell>{user.nombre_usuario}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col gap-1">
                  <ModalAddUser
                    initialData={user}
                    onSubmitCallback={fetchUsers}
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
    </>
  );
}
