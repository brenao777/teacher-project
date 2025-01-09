'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate({ User, Slot }) {
      this.belongsTo(Slot, { foreignKey: 'slotId' });
      this.belongsTo(User, { foreignKey: 'userId' });
    }
  }
  Booking.init(
    {
      userId: DataTypes.INTEGER,
      slotId: DataTypes.INTEGER,
      status: DataTypes.STRING,
      homework: DataTypes.STRING,
      duration: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Booking',
    },
  );
  return Booking;
};
