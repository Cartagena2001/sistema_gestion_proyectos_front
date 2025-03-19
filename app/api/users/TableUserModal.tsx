"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { AddUserModal } from "./AddUserModal";
import { User } from "./FormUserModal";

export function TableUserModal() {
  const [users, setUsers] = useState<User[]>([]);

  async function fetchUsers() {
    const supabase = createClient();
    const { data, error } = await supabase.from("usuarios").select("*");

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
    const { error } = await supabase.from("usuarios").delete().eq("id", userId);

    if (error) {
      toast.error("Error al eliminar el usuario");
      return;
    }
    toast.success("Usuario eliminado exitosamente");
    setUsers(users.filter((user) => user.id !== userId));
  }

  return (
    <>
      <AddUserModal onSubmitCallback={fetchUsers} />
      {/* Aquí iría la tabla con los usuarios */}
    </>
  );
}
