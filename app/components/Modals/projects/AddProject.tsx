"use client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { FormProject } from "./FormProject";
import { Project } from "./FormProject";
import { useState } from "react";

interface ModalAddProjectProps {
  initialData?: Project;
  onSubmitCallback?: () => void;
}

export function ModalAddProject({
  initialData,
  onSubmitCallback,
}: ModalAddProjectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && onSubmitCallback) {
      onSubmitCallback();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          {initialData ? "Editar proyecto" : "Agregar nuevo proyecto"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {initialData ? "Editar proyecto" : "Agregar un nuevo proyecto"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {initialData
              ? "Edita los detalles del proyecto."
              : "Agrega los detalles del nuevo proyecto."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <FormProject
          initialData={initialData}
          onSubmitCallback={() => handleOpenChange(false)}
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
