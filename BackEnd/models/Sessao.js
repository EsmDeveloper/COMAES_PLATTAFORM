import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Sessao = sequelize.define('Sessao', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'usuarios', key: 'id' },
  },
  hash_token_atualizacao: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  ip: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  agente_usuario: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  criado_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  expira_em: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  revogado_em: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'sessoes',
  timestamps: false,
});

export default Sessao;
