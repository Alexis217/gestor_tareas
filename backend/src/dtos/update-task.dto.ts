import { TaskStatus } from '../interfaces/task.interface.js';

// Aquí todos los campos son opcionales
export interface UpdateTaskDTO {
  titulo?: string;
  descripcion?: string;
  estado?: TaskStatus;
}