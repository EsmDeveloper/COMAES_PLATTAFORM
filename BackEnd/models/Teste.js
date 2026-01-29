import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Teste = sequelize.define('Teste', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  assunto: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  nivel: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  configuracoes: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  criado_por: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'usuarios', key: 'id' },
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
  tableName: 'testes',
  timestamps: false,
  indexes: [
    { fields: ['criado_por'] },
    { fields: ['assunto'] },
  ],
});

export default Teste;
