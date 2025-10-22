import { Router } from 'express';
// Importamos los (futuros) controladores
import { 
  getTasks, 
  getTaskById, 
  createTask, 
  updateTask, 
  deleteTask 
} from '../controllers/tasks.controller.js'; // .js es necesario

const router = Router();

// Definimos las rutas del CRUD para /api/tasks

// GET /api/tasks -> Listar todas las tareas
router.get('/', getTasks);

// POST /api/tasks -> Crear una nueva tarea
router.post('/', createTask);

// GET /api/tasks/:id -> Obtener una sola tarea por ID
router.get('/:id', getTaskById);

// PUT /api/tasks/:id -> Actualizar una tarea por ID
router.put('/:id', updateTask);

// DELETE /api/tasks/:id -> Eliminar una tarea por ID
router.delete('/:id', deleteTask);

export default router;