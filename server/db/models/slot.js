'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Slot extends Model {
    static associate({ Booking, AdminUser }) {
      this.hasMany(Booking, { foreignKey: 'slotId' });
      this.belongsTo(AdminUser, { foreignKey: 'adminId' });
    }
  }
  Slot.init(
    {
      startTime: DataTypes.DATE,
      endTime: DataTypes.DATE,
      adminId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Slot',
    },
  );
  return Slot;
};
