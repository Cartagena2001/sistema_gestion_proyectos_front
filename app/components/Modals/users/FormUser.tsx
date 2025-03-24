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

interface Role {
  id: string;
  nombre: string;
}

// Update the User interface
export interface User {
  id: string;
  nombre_usuario: string;
  email: string;
  password: string;  // Changed from contraseña
  rol_id: number;
  roles?: {
    nombre: string;
  };
}

// Update the form schema
const formSchema = z.object({
  nombre_usuario: z.string().min(1, "El nombre de usuario es obligatorio."),
  email: z.string().email("Correo electrónico inválido."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."), // Changed from contraseña
  rol_id: z.coerce.number().min(1, "El rol es obligatorio."),
});

interface FormUserProps {
  initialData?: User;
  onSubmitCallback?: () => void;
}

export function FormUser({ initialData, onSubmitCallback }: FormUserProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre_usuario: initialData?.nombre_usuario || "",
      email: initialData?.email || "",
      password: initialData?.password || "",  // Changed from contraseña
      rol_id: initialData?.rol_id || 2, // Default to role 2 (non-admin) for new users
    },
  });
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    async function fetchRoles() {
      const supabase = createClient();
      const { data: rolesData } = await supabase
        .from("roles")
        .select("id, nombre")
        .neq('id', 1);
      if (rolesData) setRoles(rolesData);
    }
    fetchRoles();
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
      ({ error } = await supabase.from("usuarios").update(data).eq("id", initialData.id));
    } else {
      ({ error } = await supabase.from("usuarios").insert([data]));
    }

    if (error) {
      toast.error("Error al guardar el usuario: " + error.message);
    } else {
      toast.success("Usuario guardado correctamente");
      form.reset();
      if (onSubmitCallback) onSubmitCallback();
    }
  };

  return (
    <Form {...form}>
      <Toaster />
      <form className="flex flex-col gap-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        
        {/* Nombre de Usuario */}
        <FormField
          control={form.control}
          name="nombre_usuario"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de Usuario</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Correo Electrónico */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Contraseña */}
        <FormField
          control={form.control}
          name="password"  // Changed from contraseña
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Selección de Rol */}
        <FormField
          control={form.control}
          name="rol_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <FormControl>
                <Select 
                  value={field.value.toString()} 
                  onValueChange={(value) => field.onChange(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botón de envío */}
        <Button type="submit" className="mt-5 w-full cursor-pointer">
          {initialData?.id ? "Actualizar Usuario" : "Agregar Usuario"}
        </Button>

      </form>
    </Form>
  );
}
