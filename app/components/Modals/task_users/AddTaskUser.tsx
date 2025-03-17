"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { FormTaskUser } from "./FormTaskUser";
import { TaskUser } from "./FormTaskUser";
import { useState } from "react";

interface ModalAddTaskUserProps {
  initialData?: TaskUser;
  onSubmitCallback?: () => void;
}

export function ModalAddTaskUser({ initialData, onSubmitCallback }: ModalAddTaskUserProps) {
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
          {initialData ? "Editar asignación" : "Asignar usuario a tarea"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {initialData ? "Editar asignación de tarea" : "Nueva asignación de tarea"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {initialData
              ? "Edita los detalles de la asignación."
              : "Asigna un usuario a una tarea."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <FormTaskUser
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
