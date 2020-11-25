'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      chat.belongsTo(models.user, {foreignKey: 'recipient', as: 'recipientDetail'})
      chat.belongsTo(models.user, {foreignKey: 'sender', as: 'senderDetail'})
    }
  };
  chat.init({
    sender: DataTypes.INTEGER,
    recipient: DataTypes.INTEGER,
    message: DataTypes.TEXT,
    isLates: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'chat',
  });
  return chat;
};