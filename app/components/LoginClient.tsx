"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { loginWithCredentials } from "../services/auth.service";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

export function LoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await loginWithCredentials(email, password);
      
      if (response) {
        document.cookie = `token=${response.token}; path=/; max-age=86400`;
        
        localStorage.setItem('userData', JSON.stringify(response.user));
        
        toast.success('Inicio de sesión exitoso');
        router.push('/dashboard');
      } else {
        toast.error('Credenciales inválidas');
      }
    } catch (error) {
      toast.error('Error al iniciar sesión' + error);
    }
  };

  return (
    <section className="">
      <Toaster />
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Inicia sesión
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Tu correo electronico
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <Button type="submit" className="cursor-pointer">
                  Iniciar sesión
                </Button>
              </div>
              <div className="text-center text-sm">
              ¿No tienes una cuenta?{" "}
              <Link href="/register" className="text-blue-500 hover:underline">
                Registrate
              </Link>
            </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginClient;
