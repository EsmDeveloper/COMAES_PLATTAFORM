import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Pergunta = sequelize.define('Pergunta', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  teste_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'testes', key: 'id' },
  },
  ordem_indice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM('matematica', 'ingles', 'programacao', 'multipla_escolha', 'texto'),
    allowNull: false,
  },
  texto_pergunta: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  opcoes: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  resposta_correta: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  pontos: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  midia: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  criado_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'perguntas',
  timestamps: false,
  indexes: [
    { fields: ['teste_id'] },
  ],
});

export default Pergunta;
