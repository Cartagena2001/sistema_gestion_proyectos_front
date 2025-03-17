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
import { Badge } from "@/components/ui/badge";
import Swal from "sweetalert2";
import { ModalAddTask } from "./AddTask";
import { Task } from "./FormTask";

export function TableTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  async function fetchTasks() {
    const supabase = createClient();
    const { data, error } = await supabase.from("tareas").select("*");

    if (error) {
      toast.error("Ocurrió un error al obtener las tareas");
      return;
    }
    setTasks(data || []);
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  async function handleTaskDelete(taskId: string) {
    const supabase = createClient();
    const { error } = await supabase.from("tareas").delete().eq("id", taskId);

    if (error) {
      toast.error("Ocurrió un error al eliminar la tarea");
      return;
    }
    toast.success("Tarea eliminada exitosamente");
    setTasks(tasks.filter((task) => task.id !== taskId));
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Nombre de la tarea</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Fecha de vencimiento</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">{task.nombre}</TableCell>
              <TableCell>{task.descripcion}</TableCell>
              <TableCell>{task.fecha_vencimiento || "Sin fecha"}</TableCell>
              <TableCell>
                {task.estado === "completada" ? (
                  <Badge>Completada</Badge>
                ) : task.estado === "en progreso" ? (
                  <Badge>En progreso</Badge>
                ) : (
                  <Badge variant="destructive">Pendiente</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col gap-1">
                  <ModalAddTask
                    initialData={task}
                    onSubmitCallback={fetchTasks}
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
                          if (task.id) {
                            handleTaskDelete(task.id);
                          } else {
                            toast.error("ID de tarea no válido");
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
      {selectedTask && (
        <ModalAddTask
          initialData={selectedTask}
          onSubmitCallback={() => {
            fetchTasks();
            setSelectedTask(null);
          }}
        />
      )}
    </>
  );
}
