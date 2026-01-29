import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Midia = sequelize.define('Midia', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tipo_proprietario: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  id_proprietario: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING(1024),
    allowNull: false,
  },
  tipo_mime: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  tamanho_bytes: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  criado_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'midia',
  timestamps: false,
  indexes: [
    { fields: ['tipo_proprietario', 'id_proprietario'] },
  ],
});

export default Midia;
