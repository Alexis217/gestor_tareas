import { Router } from 'express';
import taskRouter from './tasks.routes.js'; // Importamos el enrutador de tareas

const router = Router();

// Cuando alguien vaya a /api/tasks, será manejado por taskRouter
router.use('/tasks', taskRouter);

// (Si en el futuro tienes un enrutador de usuarios, lo pondrías aquí)
// router.use('/users', userRouter);

export default router;