"use client"
import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { FaProjectDiagram, FaTasks } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

interface SideBarProps {
  children: ReactNode;
}

const SideBar = ({ children }: SideBarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: <MdDashboard /> },
    { href: '/dashboard/proyectos', label: 'Proyectos', icon: <FaProjectDiagram /> },
    { href: '/dashboard/proyectos/tareas', label: 'Tareas', icon: <FaTasks /> },
  ]

  return (
    <>
      <button onClick={toggleSidebar} data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 z-50">
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
        </svg>
      </button>
      <aside id="default-sidebar" className={`z-10 mt-12 lg:mt-0 fixed top-0 left-0  w-64 h-screen transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`} aria-label="Sidebar">
        <h1 className='p-5 text-2xl font-bold text-gray-900'>Gestion de proyectos</h1>
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50">
          <ul className="space-y-2 font-medium">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>
                  <div className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                    {link.icon}
                    <span className="flex-1 ms-3 whitespace-nowrap">{link.label}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className="p-10 sm:ml-64 z-20">
        {children}
      </div>
    </>
  );
};

export default SideBar;
