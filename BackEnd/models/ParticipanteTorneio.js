import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ParticipanteTorneio = sequelize.define('ParticipanteTorneio', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  torneio_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'torneios', key: 'id' },
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'usuarios', key: 'id' },
  },
  entrou_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM('pendente', 'confirmado', 'removido'),
    defaultValue: 'pendente',
  },
  pontuacao: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  posicao: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  casos_resolvidos: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  disciplina_competida: {
    type: DataTypes.ENUM('Matemática', 'Inglês', 'Programação'),
    allowNull: true,
  },
  metadados: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'participantes_torneio',
  timestamps: false,
  indexes: [
    { fields: ['torneio_id'] },
    { unique: true, fields: ['torneio_id', 'usuario_id'] },
  ],
});

export default ParticipanteTorneio;
