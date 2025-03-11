import type { Metadata } from "next";
import "../ui/globals.css";
import SideBar from "../components/SideBar";

export const metadata: Metadata = {
  title: "Sistema de gestion de proyectos",
  description: "Sistema de gestion de proyectos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SideBar {...{ children }} />;
}
