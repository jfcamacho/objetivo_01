'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Archivo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Archivo.belongsTo(models.Usuario, {
        foreignKey: 'idUsuario',
        targetKey: 'id'
      }),
      Archivo.belongsTo(models.Estado, {
        foreignKey: 'idEstado',
        targetKey: 'id'
      })
    }
  }
  Archivo.init({
    idUsuario: DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    path: DataTypes.STRING,
    idEstado: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Archivo',
  });
  return Archivo;
};