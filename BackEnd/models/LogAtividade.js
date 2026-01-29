import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const LogAtividade = sequelize.define('LogAtividade', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'usuarios', key: 'id' },
  },
  acao: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  tipo_objeto: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  id_objeto: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  metadados: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  criado_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'logs_atividade',
  timestamps: false,
  indexes: [
    { fields: ['usuario_id'] },
    { fields: ['criado_em'] },
  ],
});

export default LogAtividade;
