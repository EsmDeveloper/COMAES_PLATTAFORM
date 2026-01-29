import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Comentario = sequelize.define('Comentario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tipo_objeto: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  id_objeto: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'usuarios', key: 'id' },
  },
  comentario_pai_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'comentarios', key: 'id' },
  },
  conteudo: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  oculto: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  criado_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  atualizado_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
  },
}, {
  tableName: 'comentarios',
  timestamps: false,
  indexes: [
    { fields: ['usuario_id'] },
    { fields: ['tipo_objeto', 'id_objeto'] },
  ],
});

export default Comentario;
