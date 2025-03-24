"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import toast, { Toaster } from "react-hot-toast";

export interface Project {
  id: string;
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
}

const formSchema: z.ZodSchema = z.object({
  nombre: z.string().min(1, {
    message: "El nombre del proyecto es obligatorio.",
  }),
  descripcion: z.string().optional(),
  fecha_inicio: z.string({
    required_error: "La fecha de inicio es obligatoria.",
  }),
  fecha_fin: z.string({
    required_error: "La fecha de fin es obligatoria.",
  }),
  estado: z.string().min(1, {
    message: "El estado es obligatorio.",
  }),
});

interface FormProjectProps {
  initialData?: Project;
  onSubmitCallback?: () => void;
}

export function FormProject({ initialData, onSubmitCallback }: FormProjectProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      nombre: "",
      descripcion: "",
      fecha_inicio: "",
      fecha_fin: "",
      estado: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const supabase = createClient();
    let error;
    if (initialData?.id) {
      ({ error } = await supabase.from("proyectos").update(data).eq("id", initialData.id));
    } else {
      ({ error } = await supabase.from("proyectos").insert([data]));
    }
    if (error) {
      toast.error("Error al guardar el proyecto: " + error.message);
    } else {
      toast.success("Proyecto guardado exitosamente");
      form.reset();
      if (onSubmitCallback) onSubmitCallback();
    }
  };

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData]);

  return (
    <Form {...form}>
      <Toaster />
      <form
        className="flex flex-col gap-y-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Proyecto</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name="fecha_inicio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de Inicio</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fecha_fin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de Fin</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-5 w-full cursor-pointer">
          {initialData?.id ? "Actualizar Proyecto" : "Guardar Proyecto"}
        </Button>
      </form>
    </Form>
  );
}
