"use client";
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
import { FormUserModal } from "./FormUserModal"; // Ajustamos el nombre
import { User } from "./FormUserModal"; 
import { useState } from "react";

interface AddUserModalProps {
  initialData?: User;
  onSubmitCallback?: () => void;
}

export function AddUserModal({ initialData, onSubmitCallback }: AddUserModalProps) {
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
          {initialData ? "Editar usuario" : "Agregar nuevo usuario"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {initialData ? "Editar usuario" : "Agregar un nuevo usuario"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {initialData
              ? "Edita los detalles del usuario."
              : "Agrega los detalles del nuevo usuario."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <FormUserModal
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

