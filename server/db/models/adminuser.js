'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdminUser extends Model {
    static associate(models) {}
  }
  AdminUser.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      isAdmin: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'AdminUser',
    },
  );
  return AdminUser;
};
