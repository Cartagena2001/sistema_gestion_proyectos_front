"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";

interface ProjectTask {
  id: string;
  nombre: string;
  descripcion: string;
  estado: string;
  fecha_vencimiento: string;
  tareas_usuarios: {
    usuarios: {
      nombre_usuario: string;
    };
  }[];
}

interface ProjectComment {
  id: string;
  comentario: string;
  created_at: string;
  usuarios: {
    nombre_usuario: string;
  };
}

interface ProjectViewAdminProps {
    projectId: string;
}

export default function ProjectViewAdmin({ projectId }: ProjectViewAdminProps) {
  const searchParams = useSearchParams();
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [comments, setComments] = useState<Record<string, ProjectComment[]>>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId) return;
      const supabase = createClient();

      // Fetch project details
      const { data: projectData } = await supabase
        .from("proyectos")
        .select("*")
        .eq("id", projectId)
        .single();

      if (projectData) {
        setProject(projectData);

        // Fetch tasks with assigned users
        const { data: tasksData } = await supabase
          .from("tareas")
          .select(`
            *,
            tareas_usuarios (
              usuarios (
                nombre_usuario
              )
            )
          `)
          .eq("proyecto_id", projectId);

        if (tasksData) {
          setTasks(tasksData);

          // Fetch comments for each task
          const commentsPromises = tasksData.map((task) =>
            supabase
              .from("comentarios_tareas")
              .select(`
                *,
                usuarios (
                  nombre_usuario
                )
              `)
              .eq("id_tarea", task.id)
              .order("created_at", { ascending: false })
          );

          const commentsResults = await Promise.all(commentsPromises);
          const commentsMap: Record<string, ProjectComment[]> = {};
          
          commentsResults.forEach((result, index) => {
            if (result.data) {
              commentsMap[tasksData[index].id] = result.data;
            }
          });

          setComments(commentsMap);
        }
      }
      setLoading(false);
    };

    fetchProjectData();
  }, [projectId]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!project) {
    return <div>Proyecto no encontrado</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{project.nombre}</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
        >
          Volver
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalles del Proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>{project.descripcion}</p>
            <div className="flex gap-4">
              <span>
                Inicio: {format(new Date(project.fecha_inicio), "dd MMM yyyy", { locale: es })}
              </span>
              <span>
                Fin: {format(new Date(project.fecha_fin), "dd MMM yyyy", { locale: es })}
              </span>
              <Badge variant={project.estado === "activo" ? "default" : "destructive"}>
                {project.estado}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tareas del Proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{task.nombre}</h3>
                    <p className="text-sm text-gray-600">{task.descripcion}</p>
                  </div>
                  <Badge variant={
                    task.estado === "completada" ? "default" :
                    task.estado === "en_progreso" ? "secondary" : "outline"
                  }>
                    {task.estado}
                  </Badge>
                </div>
                
                <div className="text-sm text-gray-500 mb-2">
                  Vence: {format(new Date(task.fecha_vencimiento), "dd MMM yyyy", { locale: es })}
                </div>

                <div className="mb-2">
                  <strong className="text-sm">Asignada a:</strong>
                  <div className="flex gap-2 mt-1">
                    {task.tareas_usuarios.map((tu, index) => (
                      <Badge key={index} variant="outline">
                        {tu.usuarios.nombre_usuario}
                      </Badge>
                    ))}
                  </div>
                </div>

                {comments[task.id]?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Comentarios</h4>
                    <div className="space-y-2">
                      {comments[task.id].map((comment) => (
                        <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">
                              {comment.usuarios.nombre_usuario}
                            </span>
                            <span className="text-gray-500">
                              {format(new Date(comment.created_at), "dd MMM yyyy HH:mm", { locale: es })}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{comment.comentario}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {tasks.length === 0 && (
              <p className="text-center text-gray-500">No hay tareas en este proyecto</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}