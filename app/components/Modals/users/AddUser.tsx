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
import { FormUser } from "./FormUser";
import { User } from "./FormUser";
import { useState } from "react";

interface ModalAddUserProps {
  initialData?: User;
  onSubmitCallback?: () => void;
}

export function ModalAddUser({ initialData, onSubmitCallback }: ModalAddUserProps) {
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
          {initialData ? "Editar usuario" : "Agregar usuario"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {initialData ? "Editar usuario" : "Nuevo usuario"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {initialData ? "Edita los detalles del usuario." : "Agrega un nuevo usuario al sistema."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <FormUser
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
