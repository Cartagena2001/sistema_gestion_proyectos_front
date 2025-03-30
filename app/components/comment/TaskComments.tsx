"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import toast from "react-hot-toast";

interface Comment {
  id: string;
  comentario: string;
  id_tarea: string;
  id_usuario: string;
  created_at: string;
  usuarios: {
    nombre_usuario: string;
  };
}

interface TaskCommentsProps {
  taskId: string;
}

export function TaskComments({ taskId }: TaskCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("comentarios_tareas")
      .select(
        `
        *,
        usuarios (
          nombre_usuario
        )
      `
      )
      .eq("id_tarea", taskId)
      .order("created_at", { ascending: false });

    if (data) {
      setComments(data);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast.error("El comentario no puede estar vacío");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const userData = localStorage.getItem("userData");
    const user = userData ? JSON.parse(userData) : null;

    if (!user) {
      toast.error("Debe iniciar sesión para comentar");
      return;
    }

    const { error } = await supabase.from("comentarios_tareas").insert([
      {
        comentario: newComment,
        id_tarea: taskId,
        id_usuario: user.id,
      },
    ]);

    if (error) {
      toast.error("Error al agregar el comentario");
    } else {
      toast.success("Comentario agregado exitosamente");
      setNewComment("");
      fetchComments();
    }
    setLoading(false);
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 rounded-lg p-3 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {comment.usuarios.nombre_usuario}
              </span>
              <span className="text-xs text-gray-500">
                {format(new Date(comment.created_at), "dd MMM yyyy HH:mm", {
                  locale: es,
                })}
              </span>
            </div>
            <p className="text-sm text-gray-600">{comment.comentario}</p>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <Textarea
          placeholder="Escribe un comentario..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button
          onClick={handleSubmitComment}
          disabled={loading}
          className="w-full cursor-pointer"
        >
          {loading ? "Enviando..." : "Enviar comentario"}
        </Button>
      </div>
    </div>
  );
}
