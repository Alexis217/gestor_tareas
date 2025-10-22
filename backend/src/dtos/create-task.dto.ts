// No necesitamos 'estado' aquí, porque el modelo
// ya define 'pendiente' como valor por defecto.
export interface CreateTaskDTO {
  titulo: string;
  descripcion: string;
}