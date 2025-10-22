import { Sequelize } from 'sequelize';
import { config } from './index.js'; // Usamos .js por ser ES Modules

// Creamos la instancia de Sequelize
const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: 'postgres',
    logging: false, // Desactiva los logs de SQL en la consola (opcional)
  }
);

// Exportamos la instancia para usarla en los modelos
export default sequelize;

// Función asíncrona para probar la conexión
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL establecida correctamente.');
    
    // Sincroniza los modelos (crea las tablas si no existen)
    // 'force: false' evita que se borren las tablas en cada reinicio
    await sequelize.sync({ force: false }); 
    console.log('🐘 Modelos sincronizados con la base de datos.');

  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error);
    process.exit(1); // Detiene la aplicación si no se puede conectar
  }
};