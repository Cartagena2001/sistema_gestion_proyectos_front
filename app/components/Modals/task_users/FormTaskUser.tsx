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

export interface TaskUser {
  id: string;
  tarea_id: string;
  usuario_id: string;
  fecha_asignacion: string;
  tareas: Task;
  usuarios: User;
}

interface Task {
  id: string;
  nombre: string;
}

interface User {
  id: string;
  nombre: string;
  nombre_usuario: string;
}

const formSchema: z.ZodSchema = z.object({
  tarea_id: z.string().uuid({ message: "La tarea es obligatoria." }),
  usuario_id: z.string().uuid({ message: "El usuario es obligatorio." }),
  fecha_asignacion: z.string({ required_error: "La fecha es obligatoria." }),
});

interface FormTaskUserProps {
  initialData?: TaskUser;
  onSubmitCallback?: () => void;
}

export function FormTaskUser({ initialData, onSubmitCallback }: FormTaskUserProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      tarea_id: "",
      usuario_id: "",
      fecha_asignacion: "",
    },
  });

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      const { data: taskData } = await supabase.from("tareas").select("id, nombre");
      const { data: userData } = await supabase.from("usuarios").select("id, nombre_usuario");

      if (taskData) setTasks(taskData);
      if (userData) setUsers(userData.map(user => ({ id: user.id, nombre: user.nombre_usuario, nombre_usuario: user.nombre_usuario })));
    }

    fetchData();
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
      ({ error } = await supabase.from("tareas_usuarios").update(data).eq("id", initialData.id));
    } else {
      ({ error } = await supabase.from("tareas_usuarios").insert([data]));
    }

    if (error) {
      toast.error("Error al guardar la asignación: " + error.message);
    } else {
      toast.success("Usuario asignado correctamente");
      form.reset();
      if (onSubmitCallback) onSubmitCallback();
    }
  };

  return (
    <Form {...form}>
      <Toaster />
      <form className="flex flex-col gap-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        
        {/* Selección de Tarea */}
        <FormField
          control={form.control}
          name="tarea_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tarea</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una tarea" />
                  </SelectTrigger>
                  <SelectContent>
                    {tasks.map((task) => (
                      <SelectItem key={task.id} value={task.id}>
                        {task.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Selección de Usuario */}
        <FormField
          control={form.control}
          name="usuario_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuario</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Fecha de Asignación */}
        <FormField
          control={form.control}
          name="fecha_asignacion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de Asignación</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botón de envío */}
        <Button type="submit" className="mt-5 w-full cursor-pointer">
          {initialData?.id ? "Actualizar Asignación" : "Asignar Usuario"}
        </Button>

      </form>
    </Form>
  );
}
