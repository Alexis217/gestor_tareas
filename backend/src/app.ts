import express, { Application, Request, Response } from 'express';
import apiRoutes from './routes/index.js';

// 1. Importa el middleware
import { errorHandler } from './middleware/errorHandler.js';

const app: Application = express();

// --- Middlewares ---
app.use(express.json());

// --- Rutas ---
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ 
    message: '¡Bienvenido al Gestor de Tareas API!' 
  });
});

app.use('/api', apiRoutes);


// --- Manejo de Errores ---
// 2. Úsalo DESPUÉS de las rutas
app.use(errorHandler);

export default app;