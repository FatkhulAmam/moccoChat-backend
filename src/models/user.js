'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init({
    telphone: DataTypes.STRING,
    user_name: DataTypes.STRING,
    bio: DataTypes.STRING,
    photo: DataTypes.STRING,
    device_token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};