"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre_usuario: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Las contraseñas no coinciden");
        setLoading(false);
        return;
      }

      const supabase = createClient();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Por favor ingrese un email válido");
        return;
      }

      if (formData.password.length < 6) {
        toast.error("La contraseña debe tener al menos 6 caracteres");
        return;
      }

      const { error: insertError } = await supabase
        .from("usuarios")
        .insert([
          {
            nombre_usuario: formData.nombre_usuario,
            email: formData.email,
            password: formData.password,
            rol_id: 2, //rol: miembro_equipo
          },
        ]);

      if (insertError) {
        toast.error("Error al crear el usuario");
        return;
      }

      toast.success("Usuario registrado exitosamente");
      router.push("/");
    } catch (error) {
      toast.error("Error al registrar el usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Registro</CardTitle>
          <CardDescription>
            Crea una cuenta para comenzar a usar la aplicación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre_usuario">Nombre de Usuario</Label>
              <Input
                id="nombre_usuario"
                placeholder="Ingrese su nombre de usuario"
                required
                value={formData.nombre_usuario}
                onChange={(e) =>
                  setFormData({ ...formData, nombre_usuario: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingrese su contraseña"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirme su contraseña"
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
            </div>
            <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
              {loading ? "Registrando..." : "Registrarse"}
            </Button>
            <div className="text-center text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/" className="text-blue-500 hover:underline">
                Iniciar sesión
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}