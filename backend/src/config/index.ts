import 'dotenv/config'; // Carga las variables de .env al inicio

// Objeto para almacenar y exportar la configuración
export const config = {
  port: process.env.PORT || 3000,
  
  db: {
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || 'tasks_db',
  }
};