export interface Project {
  id: string;
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
}

export interface Task {
  id: string;
  proyecto_id: string;
  nombre: string;
  descripcion: string;
  estado: string;
  fecha_vencimiento: string;
}