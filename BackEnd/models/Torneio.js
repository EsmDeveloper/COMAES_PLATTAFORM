import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Torneio = sequelize.define('Torneio', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  regras: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  inicia_em: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  termina_em: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  maximo_participantes: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  criado_por: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'usuarios', key: 'id' },
  },
  status: {
    type: DataTypes.ENUM('rascunho', 'agendado', 'ativo', 'finalizado', 'cancelado'),
    defaultValue: 'rascunho',
  },
  publico: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
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
  tableName: 'torneios',
  timestamps: false,
  indexes: [
    { fields: ['slug'] },
    { fields: ['criado_por'] },
  ],
});

export default Torneio;
