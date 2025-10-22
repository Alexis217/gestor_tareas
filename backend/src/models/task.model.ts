import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import type { ITask, TaskStatus } from '../interfaces/task.interface.js';

// Definimos la clase Task que extiende de Model e implementa nuestra interfaz
class Task extends Model<ITask> implements Omit<ITask, 'id'> {
  public id!: number;
  public titulo!: string;
  public descripcion!: string;
  public estado!: TaskStatus;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Inicializamos el modelo (definimos las columnas de la tabla)
Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT, // TEXT para descripciones largas
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'completada'),
      defaultValue: 'pendiente',
      allowNull: false,
    },
  },
  {
    tableName: 'tasks', // Nombre de la tabla en la BD
    sequelize, // La instancia de Sequelize que creamos
    timestamps: true, // Habilita createdAt y updatedAt
  }
);

export default Task;