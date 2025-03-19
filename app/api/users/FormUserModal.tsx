"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createClient } from "@/utils/supabase/client";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import bcrypt from "bcryptjs";

const formSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre del usuario es obligatorio." }),
  nombre_usuario: z.string().min(1, { message: "El nombre de usuario es obligatorio." }),
  email: z.string().email({ message: "Debe ser un correo válido." }),
  rol: z.enum(["admin", "editor", "viewer"], {
    message: "El rol es obligatorio.",
  }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
});

export interface User {
  id?: string;
  nombre: string;
  nombre_usuario: string;
  email: string;
  rol: "admin" | "editor" | "viewer";
  password: string;
}

interface FormUserModalProps {
  initialData?: User;
  onSubmitCallback?: () => void;
}

export function FormUserModal({ initialData, onSubmitCallback }: FormUserModalProps) {
  const supabase = createClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      nombre: "",
      nombre_usuario: "",
      email: "",
      rol: "viewer",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      let error;
      const hashedPassword = await bcrypt.hash(data.password, 10);

      if (initialData?.id) {
        ({ error } = await supabase
          .from("usuarios") 
          .update({ ...data, password: hashedPassword })
          .eq("id", initialData.id));
      } else {
        ({ error } = await supabase
          .from("usuarios")
          .insert([{ ...data, password: hashedPassword }]));
      }

      if (error) {
        toast.error("Error al guardar el usuario: " + error.message);
      } else {
        toast.success("Usuario guardado exitosamente");
        form.reset();
        if (onSubmitCallback) onSubmitCallback();
      }
    } catch (error) {
      console.error(error);
      toast.error("Error interno al procesar el usuario.");
    }
  };

  return (
    <form className="flex flex-col gap-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <Toaster />

      <div>
        <label>Nombre</label>
        <Input {...form.register("nombre")} />
      </div>

      <div>
        <label>Nombre de Usuario</label>
        <Input {...form.register("nombre_usuario")} />
      </div>

      <div>
        <label>Correo Electrónico</label>
        <Input type="email" {...form.register("email")} />
      </div>

      <div>
        <label>Rol</label>
        <select {...form.register("rol")} className="border rounded p-2">
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>

      <div>
        <label>Contraseña</label>
        <Input type="password" {...form.register("password")} />
      </div>

      <Button type="submit">{initialData?.id ? "Actualizar Usuario" : "Guardar Usuario"}</Button>
    </form>
  );
}
