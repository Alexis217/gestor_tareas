import Task from '../models/task.model.js';
// Cambiamos el DTO de create-task.dto.js a update-task.dto.js (parece un typo en tu original)
import { CreateTaskDTO } from '../dtos/create-task.dto.js'; 
import { UpdateTaskDTO } from '../dtos/update-task.dto.js';
import { HttpException } from '../utils/httpException.js';
import { ITask } from '../interfaces/task.interface.js';

/**
 * Servicio para OBTENER todas las tareas
 */
// CAMBIO 1: De ITask[] a Task[]
export const getAllTasks = async (): Promise<Task[]> => {
  const tasks = await Task.findAll({
    order: [['id', 'ASC']],
  });
  return tasks;
};

/**
 * Servicio para OBTENER una tarea por ID
 */
// CAMBIO 2: De ITask a Task
export const getTaskById = async (id: number): Promise<Task> => {
  const task = await Task.findByPk(id); 
  
  if (!task) {
    throw new HttpException(404, 'Tarea no encontrada');
  }
  
  // Ahora 'task' es de tipo 'Task' (el modelo)
  return task; 
};

/**
 * Servicio para CREAR una nueva tarea
 */
// CAMBIO 3: De ITask a Task
export const createTask = async (taskData: CreateTaskDTO): Promise<Task> => {
  
  // CAMBIO 4: Usamos 'as any' para evitar el error de tipado TS2345
  // Sabemos que 'id' y 'estado' se manejan automáticamente.
  const newTask = await Task.create(taskData as any); 
  return newTask;
};

/**
 * Servicio para ACTUALIZAR una tarea
 */
// CAMBIO 5: De ITask a Task
export const updateTask = async (id: number, taskData: UpdateTaskDTO): Promise<Task> => {
  // 'task' ahora será de tipo 'Task' gracias al CAMBIO 2
  const task = await getTaskById(id);
  
  // Esto ahora funciona, porque 'task' es un modelo de Sequelize
  const updatedTask = await task.update(taskData);
  
  return updatedTask;
};

/**
 * Servicio para ELIMINAR una tarea
 */
export const deleteTask = async (id: number): Promise<void> => {
  // 'task' ahora será de tipo 'Task' gracias al CAMBIO 2
  const task = await getTaskById(id);
  
  // Esto ahora funciona
  await task.destroy();
};