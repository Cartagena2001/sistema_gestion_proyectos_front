"use client";
import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaProjectDiagram, FaTasks } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { RiLogoutBoxLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
import { useRoleAccess } from '../hooks/useRoleAccess';

interface SideBarProps {
  children: ReactNode;
}

const SideBar = ({ children }: SideBarProps) => {
  const { hasAccess } = useRoleAccess();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [user, setUser] = useState<User>();
  const [isMounted, setIsMounted] = useState(false);
  const handleSignOut = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Deseas cerrar la sesión?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem('userData');
        router.push('/');
        Swal.fire(
          '¡Sesión cerrada!',
          'Has cerrado sesión correctamente.',
          'success'
        );
      }
    });
  };

  useEffect(() => {
    setIsOpen(false);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { session },
      } = await createClient().auth.getSession();

      if (session) {
        setUser(session.user);
      }
    };
    getCurrentUser();
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: <MdDashboard />, permission: 'dashboard' },
    {
      href: "/dashboard/proyectos",
      label: "Proyectos",
      icon: <FaProjectDiagram />,
      permission: 'projects'
    },
    { href: "/dashboard/proyectos/tareas", label: "Tareas", icon: <FaTasks />, permission: 'tasks' },
    { href: "/dashboard/users", label: "Usuarios", icon: <FaUserFriends />, permission: 'users'  },
  ];

  const authorizedLinks = links.filter(link => hasAccess(link.permission));

  return (
    <>
      <button
        onClick={toggleSidebar}
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 z-50"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>
      <aside
        id="default-sidebar"
        className={`bg-slate-100 z-10 mt-12 lg:mt-0 fixed top-0 left-0  w-64 h-screen transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <h1 className="p-5 text-2xl font-bold text-gray-900">
          Gestion de proyectos
        </h1>
        <div className="h-full px-3 py-4 overflow-y-auto bg-slate-100">
          <ul className="space-y-2 font-medium">
             {authorizedLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>
                  <div
                    className={`flex items-center p-2 rounded-lg group ${
                      pathname === link.href
                        ? "bg-slate-950 text-white"
                        : "text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {link.icon}
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      {link.label}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
            <button onClick={handleSignOut} className="flex items-center gap-2 font-semibold p-2 rounded-lg group bg-slate-950 text-white hover:bg-slate-950 transition-colors cursor-pointer w-full mt-10">
            <RiLogoutBoxLine />Cerrar Sesión
            </button>
        </div>
      </aside>
      <div className="p-10 sm:ml-64 z-20 ">{children}</div>
    </>
  );
};

export default SideBar;
