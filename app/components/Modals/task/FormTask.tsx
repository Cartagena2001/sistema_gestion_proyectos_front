"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import toast, { Toaster } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Task {
  id?: string;
  proyecto_id: string;
  nombre: string;
  descripcion?: string;
  estado: string;
  fecha_vencimiento: string;
}

interface Project {
  id: string;
  nombre: string;
}

const formSchema: z.ZodSchema = z.object({
  proyecto_id: z.string().uuid({ message: "El ID del proyecto es obligatorio." }),
  nombre: z.string().min(1, { message: "El nombre de la tarea es obligatorio." }),
  descripcion: z.string().optional(),
  estado: z.string().min(1, { message: "El estado es obligatorio." }),
  fecha_vencimiento: z.string({ required_error: "La fecha de vencimiento es obligatoria." }),
});

interface FormTaskProps {
  initialData?: Task;
  onSubmitCallback?: () => void;
}

export function FormTask({ initialData, onSubmitCallback }: FormTaskProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      proyecto_id: "",
      nombre: "",
      descripcion: "",
      estado: "",
      fecha_vencimiento: "",
    },
  });

  useEffect(() => {
    async function fetchProjects() {
      const supabase = createClient();
      const { data, error } = await supabase.from("proyectos").select("id, nombre");

      if (error) {
        toast.error("Error al obtener los proyectos: " + error.message);
        return;
      }
      setProjects(data || []);
    }

    fetchProjects();
  }, []);

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const supabase = createClient();
    let error;
    
    if (initialData?.id) {
      ({ error } = await supabase.from("tareas").update(data).eq("id", initialData.id));
    } else {
      ({ error } = await supabase.from("tareas").insert([data]));
    }

    if (error) {
      toast.error("Error al guardar la tarea: " + error.message);
    } else {
      toast.success("Tarea guardada exitosamente");
      form.reset();
      if (onSubmitCallback) onSubmitCallback();
    }
  };

  return (
    <Form {...form}>
      <Toaster />
      <form className="flex flex-col gap-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        
        {/* Selección de Proyecto */}
        <FormField
          control={form.control}
          name="proyecto_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proyecto</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un proyecto" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nombre de la tarea */}
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la Tarea</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Descripción */}
        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Fecha de Vencimiento */}
        <FormField
          control={form.control}
          name="fecha_vencimiento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de Vencimiento</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Estado */}
        <FormField
          control={form.control}
          name="estado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="en_progreso">En Progreso</SelectItem>
                    <SelectItem value="completada">Completada</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botón de envío */}
        <Button type="submit" className="mt-5 w-full cursor-pointer">
          {initialData?.id ? "Actualizar Tarea" : "Guardar Tarea"}
        </Button>

      </form>
    </Form>
  );
}
