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
import { FormTask } from "./FormTask";
import { Task } from "./FormTask";
import { useState } from "react";

interface ModalAddTaskProps {
  initialData?: Task;
  onSubmitCallback?: () => void;
}

export function ModalAddTask({ initialData, onSubmitCallback }: ModalAddTaskProps) {
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
          {initialData ? "Editar tarea" : "Agregar nueva tarea"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {initialData ? "Editar tarea" : "Agregar una nueva tarea"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {initialData
              ? "Edita los detalles de la tarea."
              : "Agrega los detalles de la nueva tarea."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <FormTask
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
