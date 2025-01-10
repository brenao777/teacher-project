'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Slot extends Model {
    static associate({ Booking, AdminUser }) {
      this.hasMany(Booking, { foreignKey: 'slotId' });
    }
  }
  Slot.init(
    {
      title: DataTypes.STRING,
      start: DataTypes.STRING,
      end: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Slot',
    },
  );
  return Slot;
};
