"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema: z.ZodSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre del usuario es obligatorio." }),
  nombre_usuario: z.string().min(1, { message: "El nombre de usuario es obligatorio." }),
  email: z.string().email({ message: "Debe ser un correo válido." }),
});

export interface User {
  id?: string;
  nombre: string;
  nombre_usuario: string;
  email: string;
}

interface FormUserProps {
  initialData?: User;
  onSubmitCallback?: () => void;
}

export function FormUser({ initialData, onSubmitCallback }: FormUserProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      nombre: "",
      nombre_usuario: "",
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const supabase = createClient();
    let error;

    if (initialData?.id) {
      ({ error } = await supabase.from("users").update(data).eq("id", initialData.id));
    } else {
      ({ error } = await supabase.from("users").insert([data]));
    }

    if (error) {
      toast.error("Error al guardar el usuario: " + error.message);
    } else {
      toast.success("Usuario guardado exitosamente");
      form.reset();
      if (onSubmitCallback) onSubmitCallback();
    }
  };

  return (
    <form className="flex flex-col gap-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <Toaster />

      {/* Nombre de Usuario */}
      <div>
        <label>Nombre</label>
        <Input {...form.register("nombre")} />
      </div>

      {/* Nombre de Usuario */}
      <div>
        <label>Nombre de Usuario</label>
        <Input {...form.register("nombre_usuario")} />
      </div>

      {/* Correo Electrónico */}
      <div>
        <label>Correo Electrónico</label>
        <Input type="email" {...form.register("email")} />
      </div>

      <Button type="submit">{initialData?.id ? "Actualizar Usuario" : "Guardar Usuario"}</Button>
    </form>
  );
}
