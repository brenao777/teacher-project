'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Slot extends Model {
    static associate({ Booking, AdminUser }) {
      this.hasMany(Booking, { foreignKey: 'slotId' });
      // this.belongsTo(AdminUser, { foreignKey: 'adminId' });
    }
  }
  Slot.init(
    {
      title: DataTypes.STRING,
      start: DataTypes.STRING,
      end: DataTypes.STRING,
      // adminId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Slot',
    },
  );
  return Slot;
};
