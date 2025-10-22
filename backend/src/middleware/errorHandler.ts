import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../utils/httpException.js';

export const errorHandler = (
  error: HttpException | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Si es un error que definimos (HttpException), usamos su status y mensaje
  if (error instanceof HttpException) {
    return res.status(error.status).json({
      status: error.status,
      message: error.message,
    });
  }

  // Si es un error inesperado (ej. error 500 del servidor)
  console.error(error.stack); // Logueamos el error completo en la consola
  return res.status(500).json({
    status: 500,
    message: 'Error interno del servidor',
  });
};