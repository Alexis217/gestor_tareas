import app from './app.js';
import { config } from './config/index.js';
import { connectDB } from './config/database.js';

const PORT = config.port;

const startServer = async () => {
  try {
    // 1. Conectar a la base de datos
    await connectDB();
    
    // 2. Iniciar el servidor Express
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
    
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Arrancamos el servidor
startServer();