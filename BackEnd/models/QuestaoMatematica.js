import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const QuestaoMatematica = sequelize.define('QuestaoMatematica', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titulo: { type: DataTypes.STRING(255), allowNull: false },
  dificuldade: { type: DataTypes.ENUM('facil','medio','dificil'), allowNull: false, defaultValue: 'facil' },
  torneio_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'torneios', key: 'id' } },
  enunciado: { type: DataTypes.TEXT, allowNull: false },
  opcoes: { type: DataTypes.JSON, allowNull: true },
  correta: { type: DataTypes.JSON, allowNull: true },
  pontos: { type: DataTypes.INTEGER, defaultValue: 1 },
  midia: { type: DataTypes.JSON, allowNull: true },
  criado_em: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'questoes_matematica',
  timestamps: false,
  indexes: [{ fields: ['torneio_id'] }]
});

export default QuestaoMatematica;
