import { Request, Response, NextFunction } from 'express';

// Importamos el (futuro) servicio de tareas
// Lo importamos "todo" como un objeto TaskService para tenerlo ordenado
import * as TaskService from '../services/tasks.service.js';

// NOTA: Usamos 'NextFunction' y el 'next(error)' para
// centralizar el manejo de errores más adelante.

/**
 * Controlador para OBTENER todas las tareas
 */
export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = await TaskService.getAllTasks();
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para OBTENER una tarea por ID
 */
export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const taskId = Number(req.params.id);
    const task = await TaskService.getTaskById(taskId);
    
    // El servicio se encargará de lanzar un error si no la encuentra
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para CREAR una nueva tarea
 */
export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Aquí es donde entrarán los DTOs para validar el body
    const { titulo, descripcion } = req.body;
    
    const newTask = await TaskService.createTask({ titulo, descripcion });
    
    // 201 = Created
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para ACTUALIZAR una tarea
 */
export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const taskId = Number(req.params.id);
    // El body puede traer 'titulo', 'descripcion' o 'estado'
    const taskData = req.body; 
    
    const updatedTask = await TaskService.updateTask(taskId, taskData);
    
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para ELIMINAR una tarea
 */
export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const taskId = Number(req.params.id);
    await TaskService.deleteTask(taskId);
    
    // 204 = No Content (éxito, pero no devuelve nada)
    res.status(204).send(); 
  } catch (error) {
    next(error);
  }
};