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
import { ModalAddTaskUser } from "./AddTaskUser";
import { TaskUser } from "./FormTaskUser";

export function TableTaskUsers() {
  const [taskUsers, setTaskUsers] = useState<TaskUser[]>([]);
  const [selectedTaskUser, setSelectedTaskUser] = useState<TaskUser | null>(null);

  async function fetchTaskUsers() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("tareas_usuarios")
      .select(`
        id,
        tarea_id,
        usuario_id,
        fecha_asignacion,
        tareas (nombre),
        usuarios (nombre_usuario)
      `);

    if (error) {
      toast.error("Ocurrió un error al obtener las asignaciones");
      return;
    }
    setTaskUsers(data || []);
  }

  useEffect(() => {
    fetchTaskUsers();
  }, []);

  async function handleTaskUserDelete(taskUserId: string) {
    const supabase = createClient();
    const { error } = await supabase.from("tareas_usuarios").delete().eq("id", taskUserId);

    if (error) {
      toast.error("Ocurrió un error al eliminar la asignación");
      return;
    }
    toast.success("Asignación eliminada exitosamente");
    setTaskUsers(taskUsers.filter((taskUser) => taskUser.id !== taskUserId));
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tarea ID</TableHead>
            <TableHead>Usuario ID</TableHead>
            <TableHead>Fecha de Asignación</TableHead>
            <TableHead className="text-right">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {taskUsers.map((taskUser) => (
            <TableRow key={taskUser.id}>
              <TableCell className="font-medium">{taskUser.tareas.nombre}</TableCell>
              <TableCell>{taskUser.usuarios.nombre_usuario}</TableCell>
              <TableCell>{taskUser.fecha_asignacion || "Sin fecha"}</TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col gap-1">
                  <ModalAddTaskUser
                    initialData={taskUser}
                    onSubmitCallback={fetchTaskUsers}
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
                        confirmButtonText: "Sí, eliminarla",
                        cancelButtonText: "Cancelar",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          if (taskUser.id) {
                            handleTaskUserDelete(taskUser.id);
                          } else {
                            toast.error("ID de asignación no válido");
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
      {selectedTaskUser && (
        <ModalAddTaskUser
          initialData={selectedTaskUser}
          onSubmitCallback={() => {
            fetchTaskUsers();
            setSelectedTaskUser(null);
          }}
        />
      )}
    </>
  );
}
