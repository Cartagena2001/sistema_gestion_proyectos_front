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
import { ModalAddProject } from "./AddProject";
import { Project } from "./FormProject";

export function TableProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  async function fetchProjects() {
    const supabase = createClient();
    const { data, error } = await supabase.from("proyectos").select("*");

    if (error) {
      toast.error("Ocurrio un error al obtener los proyectos");
      return;
    } else {
      setProjects(data || []);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  async function handleProjectDelete(projectId: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("proyectos")
      .delete()
      .eq("id", projectId);

    if (error) {
      toast.error("Ocurrio un error al eliminar el proyecto");
      return;
    } else {
      toast.success("Proyecto eliminado exitosamente");
      setProjects(projects.filter((project) => project.id !== projectId));
    }
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Nombre del proyecto</TableHead>
            <TableHead>Descripcion</TableHead>
            <TableHead>Fecha incio</TableHead>
            <TableHead>Fecha Fin</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Accion</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.nombre}</TableCell>
              <TableCell>{project.descripcion}</TableCell>
              <TableCell>{project.fecha_inicio}</TableCell>
              <TableCell>{project.fecha_fin}</TableCell>
              <TableCell>
                {project.estado === "activo" ? (
                  <Badge>Activo</Badge>
                ) : (
                  <Badge variant="destructive">Inactivo</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col gap-1">
                  <ModalAddProject
                    initialData={project}
                    onSubmitCallback={fetchProjects}
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
                          handleProjectDelete(project.id);
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
      {selectedProject && (
        <ModalAddProject
          initialData={selectedProject}
          onSubmitCallback={() => {
            fetchProjects();
            setSelectedProject(null);
          }}
        />
      )}
    </>
  );
}
