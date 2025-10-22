export type TaskStatus = 'pendiente' | 'completada';

export interface ITask {
  id: number;
  titulo: string;
  descripcion: string;
  estado: TaskStatus;
  
  // Timestamps que añade Sequelize
  createdAt?: Date;
  updatedAt?: Date;
}