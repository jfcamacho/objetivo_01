'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Usuario.belongsTo(models.Persona, {
        foreignKey: 'idPersona',
        targetKey: 'id'
      }),
      Usuario.belongsTo(models.Estado, {
        foreignKey: 'idEstado',
        targetKey: 'id'
      })
    }
  }
  Usuario.init({
    idPersona: DataTypes.INTEGER,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    idEstado: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Usuario',
  });
  return Usuario;
};