"use client";
import { useEffect, useState } from "react";
import { Project, Task } from "@/app/interfaces/project";
import { createClient } from "@/utils/supabase/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export function ProjectView() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const userData = localStorage.getItem("userData");
      const user = userData ? JSON.parse(userData) : null;

      if (user) {
        // First fetch user's tasks
        const { data: tasksData } = await supabase
          .from("tareas")
          .select(`
            *,
            tareas_usuarios!inner(usuario_id)
          `)
          .eq("tareas_usuarios.usuario_id", user.id)
          .order("fecha_vencimiento", { ascending: true });

        if (tasksData) {
          setTasks(tasksData);
          
          // Get unique project IDs from user's tasks
          const userProjectIds = [...new Set(tasksData.map(task => task.proyecto_id))];
          
          // Only fetch projects that user has tasks in
          if (userProjectIds.length > 0) {
            const { data: projectsData } = await supabase
              .from("proyectos")
              .select("*")
              .in('id', userProjectIds)
              .order("fecha_inicio", { ascending: false });

            if (projectsData) {
              setProjects(projectsData);
            }
          }
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const getProjectTasks = (projectId: string) => {
    return tasks.filter((task) => task.proyecto_id === projectId);
  };

  const updateTaskStatus = async (
    taskId: string,
    currentStatus: string,
    newStatus: string
  ) => {
    if (currentStatus === "completada") {
      toast.error("No se puede modificar una tarea completada");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("tareas")
      .update({ estado: newStatus })
      .eq("id", taskId);

    if (error) {
      toast.error("Error al actualizar el estado de la tarea");
      return;
    }

    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, estado: newStatus } : task
      )
    );

    toast.success("Estado de la tarea actualizado");
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (tasks.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center text-gray-500">
          <h3 className="text-lg font-semibold mb-2">Aún no tienes tareas asignadas</h3>
          <p className="text-sm">Cuando te asignen tareas, aparecerán aquí.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {projects.map((project) => (
        <div key={project.id} className="bg-white rounded-lg shadow p-6">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {project.nombre}
            </h2>
            <p className="text-gray-600 mt-2">{project.descripcion}</p>
            <div className="flex gap-4 mt-2 text-sm text-gray-500">
              <span>
                Inicio:{" "}
                {format(new Date(project.fecha_inicio), "dd MMM yyyy", {
                  locale: es,
                })}
              </span>
              <span>
                Fin:{" "}
                {format(new Date(project.fecha_fin), "dd MMM yyyy", {
                  locale: es,
                })}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  project.estado === "activo"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {project.estado}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Mis Tareas</h3>
            <div className="space-y-3">
              {getProjectTasks(project.id).map((task) => (
                <div key={task.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {task.nombre}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {task.descripcion}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          task.estado === "completada"
                            ? "bg-green-100 text-green-800"
                            : task.estado === "en_progreso"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {task.estado}
                      </span>
                      {task.estado !== "completada" && (
                        <div className="flex gap-2">
                          {task.estado === "pausada" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="cursor-pointer"
                              onClick={() =>
                                updateTaskStatus(
                                  task.id,
                                  task.estado,
                                  "en_progreso"
                                )
                              }
                            >
                              Reanudar
                            </Button>
                          )}
                          {task.estado === "en_progreso" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="cursor-pointer"
                              onClick={() =>
                                updateTaskStatus(
                                  task.id,
                                  task.estado,
                                  "pausada"
                                )
                              }
                            >
                              Pausar
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-green-50 text-green-600 hover:bg-green-100 cursor-pointer"
                            onClick={() =>
                              updateTaskStatus(
                                task.id,
                                task.estado,
                                "completada"
                              )
                            }
                          >
                            Completar
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Vence:{" "}
                    {format(new Date(task.fecha_vencimiento), "dd MMM yyyy", {
                      locale: es,
                    })}
                  </div>
                </div>
              ))}
              {getProjectTasks(project.id).length === 0 && (
                <p className="text-gray-500 text-sm">
                  No tienes tareas asignadas en este proyecto.
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
      {projects.length === 0 && (
        <div className="text-center text-gray-500">
          No hay proyectos disponibles.
        </div>
      )}
    </div>
  );
}
